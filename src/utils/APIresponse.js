class APIResponse{
    constructor(
        statsuCode ,
        data ,
        message="success"
    ){
        this.statsuCode= statsuCode
        this.data=data
        this.message=message
        this.success = statsuCode < 400
    }
}

export {APIResponse}