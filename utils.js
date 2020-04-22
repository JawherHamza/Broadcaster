module.exports = {
    extractPageId : (callback) =>{
    if(callback){
        let callDivided = callback.split('/')
        return callDivided[callDivided.length - 2]
    }
    }
}