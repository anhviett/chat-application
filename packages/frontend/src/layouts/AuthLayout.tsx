import { Outlet } from "react-router-dom";
import bgImage from "@/assets/images/bg-horizontal.jpg";

const AuthLayout = () => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-[#707070] text-sm bg-cover bg-center grayscale-32`} style={{ backgroundImage: `url(${bgImage})` }}>
      <div className={`grid grid-cols-12 max-w-5xl bg-white w-[1000px] h-[600px] min-h-[600px] rounded-lg shadow p-8 relative p-[25px] bg-[#ecf0f3] shadow-[10px_10px_10px_#d1d9e6,_-10px_-10px_10px_#f9f9f9] rounded-[12px] overflow-hidden`}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;