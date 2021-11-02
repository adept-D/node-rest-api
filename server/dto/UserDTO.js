
class UserDTO{
    uuid;
    email;
    nickname;
    constructor(user){
        this.uuid = user.uuid;
        this.email = user.email;
        this.nickname = user.nickname;

    }
}

export default UserDTO;