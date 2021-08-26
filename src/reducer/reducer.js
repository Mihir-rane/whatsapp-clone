export const initialState = {
    user: null,
    currentRoomAvatar: null
}

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_CURRENT_ROOM_AVATAR: "SET_CURRENT_ROOM_AVATAR"
}

const reducer = (state, action) => {
    switch(action.type) {
        case actionTypes.SET_USER:
            return{
                ...state,
                user: action.user
            }

        case actionTypes.SET_CURRENT_ROOM_AVATAR:
            return{
                ...state,
                currentRoomAvatar: action.currentRoomAvatar
            }

        default: 
            return state;
    }
}

export default reducer;