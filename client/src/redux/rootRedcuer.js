const initalState = {
    CurrentLoggedUser:{},
    CurrentOpenChat:{},
    CurentUsedSocket:{},
    ClientIp:{},
    usercontacts:{}
}

const Reducer = (state=initalState,action) =>{
    switch(action.type){
        case "update_CurrentLoggedUser":
            return {...state,CurrentLoggedUser:action.payload}

        case "update_CurrentOpenChat":
            return {...state,CurrentOpenChat:action.payload}

        case "update_CurrentUsedSocket":
            return {...state,CurentUsedSocket : action.payload}
        
        case "Update_ClientIp":
            return {...state,ClientIp:action.payload}

        case "Update_usercontacts":
            return {...state,usercontacts:action.payload}
            
        default :
            return initalState 
    }
}

export default Reducer