const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  editMenu: state => state.user.editMenu,
  executionId: state => state.user.executionId,
  userId: state => state.user.userId
}
export default getters
