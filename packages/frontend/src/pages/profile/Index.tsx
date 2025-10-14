const Profile = () => {
    return (
        <div className="p-4">
            <div className="profile-header text-center">
                <img className="w-24 h-24 rounded-full mx-auto" src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/user/user-1.jpg" alt="User Avatar" />
                <h4 className="text-black font-semibold mt-2">Edward Lietz</h4>
                <p className="text-gray-1 text-sm">Hello, I am using DreamsChat</p>
            </div>
            <div className="profile-details mt-6 bg-white p-4 rounded-md shadow-[0_1px_5px_1px_#f3f3f3] border border-backgroundSidebar">   
                <h5 className="text-black font-semibold mb-4">Profile Information</h5>
                <ul className="space-y-3 text-sm text-gray-1">
                    <li>
                        <span className="font-semibold text-black">Email:</span>
                        <span className="ml-2">edward.lietz@example.com</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Profile;