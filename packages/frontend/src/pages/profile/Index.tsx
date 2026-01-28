import { useAuth } from "@/common/hooks/useAuth";

const Profile = () => {
  const { user: currentUser } = useAuth();

  return (
    <div className="">
      <div className="profile-header text-center px-4">
        <img
          className="w-24 h-24 rounded-full mx-auto"
          src="https://dreamschat.dreamstechnologies.com/react/template/assets/img/user/user-1.jpg"
          alt="User Avatar"
        />
        <h4 className="text-black font-semibold mt-2">{currentUser?.name}</h4>
        <p className="text-gray-1 text-sm">Hello, I am using DreamsChat</p>
      </div>
      <hr className="mt-4" />

      <div className="profile-details mt-3 py-4 mx-4">
        <h5 className="text-black font-semibold pb-4">Profile Information</h5>
        <div className="rounded-md shadow-[0_1px_5px_1px_#f3f3f3] mb-4 bg-white border border-backgroundSidebar">
          <ul className="space-y-3 text-sm text-gray-1 p-4">
            <li className="flex flex-col">
              <span className="font-semibold text-black">Name</span>
              <span className="mt-2">{currentUser?.name}</span>
            </li>
            <hr />
            <li className="flex flex-col">
              <span className="font-semibold text-black">Email</span>
              <span className="mt-2 break-all">{currentUser?.email}</span>
            </li>
            <hr />
            <li className="flex flex-col">
              <span className="font-semibold text-black">Gender</span>
              <span className="mt-2 break-all">{currentUser?.gender}</span>
            </li>
            <hr />
            <li className="flex flex-col">
              <span className="font-semibold text-black">About</span>
              <span className="mt-2 break-all">{currentUser?.about}</span>
            </li>
            <hr />
            <li className="flex flex-col">
              <span className="font-semibold text-black">Birthday</span>
              <span className="mt-2 break-all">{currentUser?.birthday}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
