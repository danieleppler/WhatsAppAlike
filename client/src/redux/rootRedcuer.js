const initalState = {
    CurrentLoggedUser:{}
}

const Reducer = (state=initalState,action) =>{
    switch(action.type){
        case "update_CurrentLoggedUser":
            return {...state,CurrentLoggedUser:action.payload} 
    }
}

export default Reducer