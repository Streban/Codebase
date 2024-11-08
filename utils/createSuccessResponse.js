const createSuccessResponse = ( {error = false, message='', data={}, code=0})=>{
    
    return {
        error,
        message,
        data,
        code
    }
}

module.exports = createSuccessResponse;