
const UserTypes = {
    SignupHandler: Symbol.for('SignupHandler'),
    AddProfileHandler: Symbol.for('AddProfileHandler'),
    GetProfilesHandler: Symbol.for('GetProfilesHandler'),
    
    UserRepository: Symbol.for('UserRepository')
}

export default UserTypes;