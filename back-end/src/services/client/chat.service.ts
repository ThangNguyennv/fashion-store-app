import Chat from '~/models/chat.model'

export const getChat = async (userId: string) => {
  let chat = await Chat.findOne({ user_id: userId })
  if (!chat) {
    chat = new Chat({ user_id: userId, messages: [] })
    await chat.save()
  }
  return chat
}