import Chat from '../models/chat';

const saveMsg = async (
    chatId: string,
    userId: string,
    query: string,
    response: string
) => {
    try {
        const chat = await Chat.findOne({ _id: chatId, fuser: userId });
        if (!chat) {
            try {
                const newChat = new Chat({
                    fuser: userId,
                    conversation: [
                        {
                            isUser: true,
                            message: query,
                        },
                        {
                            isUser: false,
                            message: response,
                        },
                    ],
                });
                await newChat.save();
                return newChat._id;
            } catch (error) {
                console.log(error);
                return null;
            }
        }

        chat.conversation.push({
            isUser: true,
            message: query,
        });
        await chat.save();

        chat.conversation.push({
            isUser: false,
            message: response,
        });
        await chat.save();

        return chat._id;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default saveMsg;
