module.exports = {
    extractPageId : (callback) =>{
    if(callback){
        let callDivided = callback.split('/')
        return callDivided[callDivided.length - 2]
    }
    },
    filterByCategory : (sessions , category) => {
        let result = [];
        for (let i = 0; i < sessions.length; i++) {
            if(sessions[i].categories){
                for (let j = 0; j < sessions[i].categories.length; j++) {
                    if(sessions[i].categories[j] === category){
                        result.push(sessions[i])
                    }
                }
            }
        }
        return result
    }
}