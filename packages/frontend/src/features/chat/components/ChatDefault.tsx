import Button from "@common/components/Button";

function ChatDefault() {
    return (
        <>
            <div className="h-full w-full mx-auto my-auto inline-flex flex-col items-center justify-center">
                <div className="inline-flex items-center justify-center p-4 relative mb-4 shadow-[0_4px_10px_0_#0000001a] rounded-[50px] bg-white relative before:content-[''] before:absolute before:left-6 before:-bottom-2 before:border-l-[8px] before:border-l-transparent before:border-r-[8px] before:border-r-transparent before:border-t-[8px] before:border-t-white before:border-b-0">
                    <span className="w-8 h-8 leading-[2] mr-2">
                        <img className="rounded-full" src="https://dreamschat.dreamstechnologies.com/react/template/src/assets/img/profiles/avatar-16.jpg" alt="" />
                    </span>
                    <h6 className="flex items-center text-black font-semibold text-lg">
                        Welcome! Salom
                        <img className="ml-2" alt="Image" src="https://dreamschat.dreamstechnologies.com/react/template/src/assets/img/icons/emoji-01.svg"></img>
                    </h6>
                </div>
                <div className="mb-4 text-md text-gray-1">
                    Choose a person or group to start chat with them.
                </div>
                <Button variant="primary" size="medium">
                    Invite group
                </Button>
            </div>
        </>
    )
}

export default ChatDefault;