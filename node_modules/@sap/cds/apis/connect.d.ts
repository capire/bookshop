import { Service } from "./services"
import * as cds from './cds'

export = cds_connect
declare class cds_connect {

	connect : {
		/**
		 * Connects to a specific datasource.
		 * @see [capire](https://cap.cloud.sap/docs/node.js/api#cds-connect)
		 */
		to (datasource?: string, options?: ConnectOptions) : Service & Promise<Service>

		/**
		 * Connects the primary datasource.
		 * @see [capire](https://cap.cloud.sap/docs/node.js/api#cds-connect)
		 */
		(options?: string | ConnectOptions) : typeof cds  //> cds.connect(<options>)
	}

	/**
	 * Emitted whenever a specific service is connected for the first time.
	 */
	on (event : 'connect', listener : (srv : Service) => void) : this

}


type ConnectOptions = {
	kind?:string,
	model?:string,
	credentials: object,
}
