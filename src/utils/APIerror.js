class APIerror extends Error{
    constructor(
        //while making object for this class we send this things as a parameter
        statusCode,
        message="someting went wrong",
        errors=[],
        stack=""
    ){
        //These are the propeerties of error
        super(message)//super is used to call parent
        this.statusCode= statusCode
        this.data=null
        this.message=message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack= stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {APIerror}