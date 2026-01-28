import { useState } from "react";
import AccordionItem from "@/common/components/AccordionItem";
import HeaderSection from "@/common/components/HeaderSection";

const Setting = () => {
  const [openItem, setOpenItem] = useState<number | null>(1);

  const handleItemClick = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="chat-search-header relative mb-4">
      <HeaderSection title="Settings" />
      <h4 className="font-bold text-xl text-black mt-4">Account Settings</h4>
      <div className="bg-gray-100 min-h-screen w-full flex justify-center pt-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {/* ✅ Example 1: Simple text content */}
              <AccordionItem
                icon={
                  <i className="fa-solid fa-user text-blue-500 text-xl"></i>
                }
                title="Profile Information"
                content="Manage your personal information, email, and password settings."
                isOpen={openItem === 1}
                onClick={() => handleItemClick(1)}
              />

              {/* ✅ Example 2: Custom children with form (giống slot Vue) */}
              <AccordionItem
                icon={
                  <i className="fa-solid fa-bell text-yellow-500 text-xl"></i>
                }
                title={
                  <span className="font-semibold text-gray-800">
                    Notification Settings
                  </span>
                }
                isOpen={openItem === 2}
                onClick={() => handleItemClick(2)}
              >
                <div className="space-y-3">
                  <p className="text-gray-600 mb-4">
                    Choose what notifications you want to receive
                  </p>
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-envelope text-gray-400"></i>
                      <span>Email Notifications</span>
                    </span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-mobile text-gray-400"></i>
                      <span>Push Notifications</span>
                    </span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-comment text-gray-400"></i>
                      <span>SMS Notifications</span>
                    </span>
                    <input type="checkbox" className="w-4 h-4" />
                  </label>
                </div>
              </AccordionItem>

              {/* ✅ Example 3: Complex form with buttons */}
              <AccordionItem
                icon={<i className="fa-solid fa-lock text-red-500 text-xl"></i>}
                title="Privacy & Security"
                isOpen={openItem === 3}
                onClick={() => handleItemClick(3)}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Who can see your profile?
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Everyone</option>
                      <option>Friends only</option>
                      <option>Only me</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Two-Factor Authentication
                    </label>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
                      Enable 2FA
                    </button>
                  </div>
                  <div className="pt-3 border-t">
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      <i className="fa-solid fa-trash-alt mr-2"></i>
                      Delete Account
                    </button>
                  </div>
                </div>
              </AccordionItem>

              {/* ✅ Example 4: Custom layout with images */}
              <AccordionItem
                icon={
                  <i className="fa-solid fa-share-nodes text-green-500 text-xl"></i>
                }
                title="Connected Accounts"
                isOpen={openItem === 4}
                onClick={() => handleItemClick(4)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        <i className="fa-brands fa-facebook-f"></i>
                      </div>
                      <div>
                        <div className="font-medium">Facebook</div>
                        <div className="text-sm text-gray-500">Connected</div>
                      </div>
                    </div>
                    <button className="text-red-500 hover:text-red-600 text-sm">
                      Disconnect
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white">
                        <i className="fa-brands fa-twitter"></i>
                      </div>
                      <div>
                        <div className="font-medium">Twitter</div>
                        <div className="text-sm text-gray-500">
                          Not connected
                        </div>
                      </div>
                    </div>
                    <button className="text-blue-500 hover:text-blue-600 text-sm">
                      Connect
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                        <i className="fa-brands fa-instagram"></i>
                      </div>
                      <div>
                        <div className="font-medium">Instagram</div>
                        <div className="text-sm text-gray-500">
                          Not connected
                        </div>
                      </div>
                    </div>
                    <button className="text-blue-500 hover:text-blue-600 text-sm">
                      Connect
                    </button>
                  </div>
                </div>
              </AccordionItem>

              {/* ✅ Example 5: List with badges */}
              <AccordionItem
                icon={<span className="text-2xl">🎨</span>}
                title="Appearance"
                isOpen={openItem === 5}
                onClick={() => handleItemClick(5)}
              >
                <div className="space-y-3">
                  <p className="text-gray-600 mb-4">
                    Customize how the app looks and feels
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg text-center hover:shadow-md transition">
                      <div className="text-2xl mb-2">☀️</div>
                      <div className="text-sm font-medium">Light</div>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg text-center hover:shadow-md transition">
                      <div className="text-2xl mb-2">🌙</div>
                      <div className="text-sm font-medium">Dark</div>
                    </button>
                    <button className="p-4 border-2 border-gray-200 rounded-lg text-center hover:shadow-md transition">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="text-sm font-medium">Auto</div>
                    </button>
                  </div>
                </div>
              </AccordionItem>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
