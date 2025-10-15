export function defineCancelApiObject<T extends Record<string, any>>(apiObject: T) {
    // A per-API-property object that exposes a cancellation handler
    type CancelEntry = {
        handleRequestCancellation: () => AbortController
    }

    // map of api property name -> CancelEntry
    const cancelApiObject: Record<string, CancelEntry> = {}

    // each property in the apiObject API layer object
    // is associated with a function that defines an API call
    Object.getOwnPropertyNames(apiObject).forEach((apiPropertyName) => {
        const cancellationControllerObject: { controller?: AbortController } = {
            controller: undefined,
        }

        // associating the request cancellation handler with the API property name
        cancelApiObject[apiPropertyName] = {
            handleRequestCancellation: () => {
                // if the controller already exists, cancel the previous request
                if (cancellationControllerObject.controller) {
                    cancellationControllerObject.controller.abort()
                }

                // generate a new controller with the AbortController factory
                cancellationControllerObject.controller = new AbortController()

                return cancellationControllerObject.controller
            },
        }
    })

    // return typed object keyed by api properties
    return cancelApiObject as Record<keyof T & string, CancelEntry>
}