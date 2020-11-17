
const runCommand = require('./runCommand');
const { nullLogger } = require('./logger');

const POLL_TIMEOUT = 180 * 1000; //ms
const POLL_RETRY_TIMEOUT = 1000; //ms, since polling takes 1-2sec, repoll almost immediately

const SPINNER_CHARS = ['-', '\\', '|', '/'];

class CfUtil {
    /**
     *
     * @param {*} serviceName
     * @param {*} logger
     * @returns service, or undefined
     */
    static async getService(serviceName, logger) {
        try {
            const serviceCmd = await runCommand('cf', ['service', serviceName], logger);

            let serviceInfo;
            if (serviceCmd.code === 0) {
                serviceInfo = {
                    name: serviceName,
                    status: /^\s*status\s*:\s*(.*)$/mi.exec(serviceCmd.stdout)[1],
                    service: /^\s*service\s*:\s*(.*)$/mi.exec(serviceCmd.stdout)[1]
                }
            }

            return serviceInfo;
        } catch (err) {
            throw this._getError(err);
        }
    }

    static async _pollService(serviceName, startTime, logger = nullLogger) {
        return new Promise((resolve, reject) => {
            this._pollServiceTimer(serviceName, startTime, resolve, reject, logger);
        });
    }

    static _pollServiceTimer(serviceName, startTime, resolve, reject, logger) {
        setTimeout(async () => {
            try {
                if (Date.now() - startTime >= POLL_TIMEOUT) {
                    logger.log();
                    reject(new Error(`[cds.deploy] - Aborting service creation after ${POLL_TIMEOUT / 1000}sec.`));
                }

                const serviceCmd = await runCommand('cf', ['service', serviceName]);
                if (serviceCmd.code !== 0) {
                    reject(new Error(`[cds.deploy] - Getting service info failed with code ${serviceCmd.code}.`));
                }

                if (serviceCmd.stdout.includes('failed')) {
                    logger.log();
                    logger.log(serviceCmd.stdout);
                    reject(new Error(`[cds.deploy] - Service creation failed.`));
                }

                if (serviceCmd.stdout.includes('succeeded')) {
                    logger.log();
                    logger.log(serviceCmd.stdout);
                    return resolve();
                }

                this._pollServiceTimer(serviceName, startTime, resolve, reject, logger);
            } catch (err) {
                reject(err);
            }
        }, POLL_RETRY_TIMEOUT);
    }

    /**
     * Triggers service creation and resolves once service is created or rejects in case of errors
     *
     * @param {*} service
     * @param {*} plan
     * @param {*} serviceName
     * @param {*} options
     * @param {*} logger
     */
    static async createService(service, plan, serviceName, options, logger) {
        // cf create-service SERVICE PLAN SERVICE_INSTANCE
        // eslint-disable-next-line no-async-promise-executor
        let spinnerId;
        try {
            const cfArgs = ['create-service', service, plan, serviceName];
            if (options) {
                cfArgs.push('-c');
                cfArgs.push(JSON.stringify(options));
            }
            const createServiceCmd = await runCommand('cf', cfArgs, logger);
            if (createServiceCmd) {
                if (createServiceCmd.code !== 0) {
                    const err = new Error('[cds.deploy] - Create request failed')
                    err.command = createServiceCmd
                    throw err;
                }

                if (createServiceCmd.stdout.includes('already exists')) {
                    return;
                }
            }

            spinnerId = this._startSpinner(logger);
            return await CfUtil._pollService(serviceName, Date.now(), logger);
        } catch (err) {
            throw this._getError(err);
        } finally {
            this._stopSpinner(spinnerId);
        }
    }

    static _startSpinner(logger) {
        let idx = 0;
        return setInterval(() => {
            logger.write(SPINNER_CHARS[idx], true);
            idx = (idx + 1) % SPINNER_CHARS.length;
        }, 400);
    }

    static _stopSpinner(id) {
        if (id) {
            clearInterval(id);
        }
    }

    /**
     * Creates the service key
     *
     * @param {*} serviceInstance
     * @param {*} serviceKeyName
     * @param {*} logger
     * @returns service key
     */
    static async createServiceKey(serviceInstance, serviceKeyName, logger) {
        try {
            const createServiceKeyCmd = await runCommand('cf', ['create-service-key', serviceInstance, serviceKeyName, '-c', `{"permissions":"development"}`], logger);
            if (createServiceKeyCmd.code === 0) {
                return await this.getServiceKey(serviceInstance, serviceKeyName);
            }

            return null;
        } catch (err) {
            throw this._getError(err);
        }
    }

    /**
     * Get the service key
     *
     * @param {*} serviceInstance
     * @param {*} serviceKeyName
     * @returns service key or null
     */
    static async getServiceKey(serviceInstance, serviceKeyName) {
        try {
            // use null logger to avoid disclosing the key to console
            const getServiceKeyCmd = await runCommand('cf', ['service-key', serviceInstance, serviceKeyName], nullLogger);
            const keyJsonStr = getServiceKeyCmd.stdout.match(/\{([\s\S]*)\}/);
            return JSON.parse(keyJsonStr[0]);
        } catch (err) {
            return null;
        }
    }

    static _getError(err) {
        if (err.code === 'ENOENT') {
            return new Error(`Command 'cf' not found. Make sure you have the Cloud Foundry command line tool installed.`);
        } else {
            return err;
        }
    }
}

module.exports = CfUtil;

/* eslint no-console: off */