import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "antd";
import RegisterForm from "@/components/Auth/RegisterForm";
import useLoginFacebook from "@/services/useLoginFacebook";
import LoginForm from "@/components/Auth/LoginForm";

const AuthPage = () => {
    const [active, setActive] = useState(false);
    const { loginWithFacebook, initFacebookSDK } = useLoginFacebook();
    const navigate = useNavigate();

    useEffect(() => {
        initFacebookSDK();
        // if token exists, redirect to dashboard
        const token = localStorage.getItem('fb_access_token') || localStorage.getItem('token');
        if (token) {
            navigate('/', { replace: true });
        }
    }, [initFacebookSDK, navigate]);
    return (
        <>
            <div className={`flex justify-center items-center absolute top-0 left-0 h-full w-[400px] p-[50px] z-[200] bg-[#ecf0f3] overflow-hidden shadow-[4px_4px_10px_#d1d9e6,_-4px_-4px_10px_#f9f9f9] transition-all duration-[1250ms] ${active ? "" : "left-[calc(100%-400px)] transition-all duration-[1250ms] origin-left"}`}>
                <div className={`absolute w-[350px] h-[350px] rounded-full bg-[#ecf0f3] shadow-[inset_8px_8px_12px_#d1d9e6,_inset_-8px_-8px_12px_#f9f9f9] transition-all duration-[1250ms] ${active ? "bottom-[-30%] left-[50%]" : "bottom-[-30%] left-[-50%] transition-all ease-in-out duration-[1250ms] origin-left"}`}>
                </div>
                <div className={`absolute w-[350px] h-[350px] rounded-full bg-[#ecf0f3] shadow-[inset_8px_8px_12px_#d1d9e6,_inset_-8px_-8px_12px_#f9f9f9] transition-all duration-[1250ms] ${active ? "bottom-[-30%] left-[-50%] left-[calc(100%-400px)] transition-all duration-[1250ms] ease-in-out origin-left absolute top-[-30%] w-[300px] h-[300px]" : "absolute top-[-30%] left-[60%] w-[300px] h-[300px]"}`}>
                </div>
                <div className={`flex justify-center items-center flex-col absolute px-[55px] py-[50px] transition-all ease-in-out duration-[1250ms] ${active ? "absolute invisible opacity-0 transition-all duration-[1250ms]" : ""}`}>
                    <h2 className="text-4xl font-bold text-title">Welcome Back</h2>
                    <p className="text-description mt-2 text-base text-center pb-3">
                        To keep connected with us please login with your personal info
                    </p>
                    <Button type="default" className="!bg-primary !text-white" shape="round" onClick={() => setActive(!active)}>Login</Button>
                </div>
                <div className={`flex justify-center items-center flex-col absolute px-[55px] py-[50px] transition-all ease-in-out duration-[1250ms] ${active ? "" : "invisible opacity-0 absolute transition-all ease-in-out duration-[1250ms]"}`}>
                    <h2 className="text-2xl font-bold text-title">Hello Friend !</h2>
                    <p className="text-description mt-2">
                        Enter your personal details and start journey with us
                    </p>
                    <Button className="!bg-primary" type="primary" shape="round" onClick={() => setActive(!active)}>Sign up</Button>
                </div>
            </div>

            {/* Render both Login and Register on same screen */}
            {/* <AuthForms /> */}
            <div className={`flex justify-center items-center flex-col absolute top-0 w-[600px] h-full p-[25px] bg-[#ecf0f3] transition-all duration-[1250ms] ${active ? "z-[100] left-[calc(100%-60%)]" : "z-[100] left-0"}`}>
                <h2 className="text-2xl font-bold text-title pb-4">Create Account</h2>
                <div className="flex items-center align-center">
                    <div onClick={loginWithFacebook} className="cursor-pointer">
                        <img className="object-contain opacity-50 w-8 transition delay-150" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI1MHB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MCA1MCIgd2lkdGg9IjUwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIj48ZyBmaWxsPSIjMDAwMDAwIiBpZD0iRmFjZWJvb2siPjxwYXRoIGQ9Ik0yNSw1MCBDMzguODA3MTE5NCw1MCA1MCwzOC44MDcxMTk0IDUwLDI1IEM1MCwxMS4xOTI4ODA2IDM4LjgwNzExOTQsMCAyNSwwIEMxMS4xOTI4ODA2LDAgMCwxMS4xOTI4ODA2IDAsMjUgQzAsMzguODA3MTE5NCAxMS4xOTI4ODA2LDUwIDI1LDUwIFogTTI1LDQ3IEMzNy4xNTAyNjUxLDQ3IDQ3LDM3LjE1MDI2NTEgNDcsMjUgQzQ3LDEyLjg0OTczNDkgMzcuMTUwMjY1MSwzIDI1LDMgQzEyLjg0OTczNDksMyAzLDEyLjg0OTczNDkgMywyNSBDMywzNy4xNTAyNjUxIDEyLjg0OTczNDksNDcgMjUsNDcgWiBNMjYuODE0NTE5NywzNiBMMjYuODE0NTE5NywyNC45OTg3MTIgTDMwLjA2ODc0NDksMjQuOTk4NzEyIEwzMC41LDIxLjIwNzYwNzIgTDI2LjgxNDUxOTcsMjEuMjA3NjA3MiBMMjYuODIwMDQ4NiwxOS4zMTAxMjI3IEMyNi44MjAwNDg2LDE4LjMyMTM0NDIgMjYuOTIwNzIwOSwxNy43OTE1MzQxIDI4LjQ0MjU1MzgsMTcuNzkxNTM0MSBMMzAuNDc2OTYyOSwxNy43OTE1MzQxIEwzMC40NzY5NjI5LDE0IEwyNy4yMjIyNzY5LDE0IEMyMy4zMTI4NzU3LDE0IDIxLjkzNjg2NzgsMTUuODM5MDkzNyAyMS45MzY4Njc4LDE4LjkzMTg3MDkgTDIxLjkzNjg2NzgsMjEuMjA4MDM2NiBMMTkuNSwyMS4yMDgwMzY2IEwxOS41LDI0Ljk5OTE0MTMgTDIxLjkzNjg2NzgsMjQuOTk5MTQxMyBMMjEuOTM2ODY3OCwzNiBMMjYuODE0NTE5NywzNiBaIE0yNi44MTQ1MTk3LDM2IiBpZD0iT3ZhbC0xIi8+PC9nPjwvZz48L3N2Zz4=" alt=""></img>
                    </div>
                    <img className="object-contain opacity-50 w-8 transition delay-150 mx-2" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI1MHB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MCA1MCIgd2lkdGg9IjUwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIj48ZyBmaWxsPSIjMDAwMDAwIiBpZD0iTGlua2VkSW4iPjxwYXRoIGQ9Ik0yNSw1MCBDMzguODA3MTE5NCw1MCA1MCwzOC44MDcxMTk0IDUwLDI1IEM1MCwxMS4xOTI4ODA2IDM4LjgwNzExOTQsMCAyNSwwIEMxMS4xOTI4ODA2LDAgMCwxMS4xOTI4ODA2IDAsMjUgQzAsMzguODA3MTE5NCAxMS4xOTI4ODA2LDUwIDI1LDUwIFogTTI1LDQ3IEMzNy4xNTAyNjUxLDQ3IDQ3LDM3LjE1MDI2NTEgNDcsMjUgQzQ3LDEyLjg0OTczNDkgMzcuMTUwMjY1MSwzIDI1LDMgQzEyLjg0OTczNDksMyAzLDEyLjg0OTczNDkgMywyNSBDMywzNy4xNTAyNjUxIDEyLjg0OTczNDksNDcgMjUsNDcgWiBNMTQsMjAuMTE4MDQ3OSBMMTQsMzQuNjU4MTgzNCBMMTguNzEwMDg1MSwzNC42NTgxODM0IEwxOC43MTAwODUxLDIwLjExODA0NzkgTDE0LDIwLjExODA0NzkgWiBNMTYuNjY0Njk2MiwxMyBDMTUuMDUzNDA1OCwxMyAxNCwxNC4wODU4NjExIDE0LDE1LjUxMTUxMjIgQzE0LDE2LjkwNzYzMzEgMTUuMDIyMjcxMSwxOC4wMjQ3NjE0IDE2LjYwMzU1NTYsMTguMDI0NzYxNCBMMTYuNjMzNjU1NiwxOC4wMjQ3NjE0IEMxOC4yNzU5ODY3LDE4LjAyNDc2MTQgMTkuMjk4ODIyMiwxNi45MDc2MzMxIDE5LjI5ODgyMjIsMTUuNTExNTEyMiBDMTkuMjY4MjUxOSwxNC4wODU4NjExIDE4LjI3NTk4NjcsMTMgMTYuNjY0Njk2MiwxMyBaIE0zMC41NzY5MjEzLDIwLjExODA0NzkgQzI4LjA3NjE3NiwyMC4xMTgwNDc5IDI2Ljk1NjU1MDEsMjEuNTI5MzE5OSAyNi4zMzE0MTA4LDIyLjUxOTM1MjcgTDI2LjMzMTQxMDgsMjAuNDU5ODY0NCBMMjEuNjIwNzYxNCwyMC40NTk4NjQ0IEMyMS42ODI4NDI3LDIxLjgyNDIzNTYgMjEuNjIwNzYxNCwzNSAyMS42MjA3NjE0LDM1IEwyNi4zMzE0MTA4LDM1IEwyNi4zMzE0MTA4LDI2Ljg3OTU4ODcgQzI2LjMzMTQxMDgsMjYuNDQ1MDMyIDI2LjM2MTk4MTIsMjYuMDExNTM2OCAyNi40ODY1MTk5LDI1LjcwMDQwODQgQzI2LjgyNjkzMiwyNC44MzIyNiAyNy42MDIwMDY5LDIzLjkzMzQyMzMgMjguOTAzMjY3NCwyMy45MzM0MjMzIEMzMC42MDgzMzgxLDIzLjkzMzQyMzMgMzEuMjg5OTE0OSwyNS4yNjY3MjAyIDMxLjI4OTkxNDksMjcuMjIwNjMzMyBMMzEuMjg5OTE0OSwzNC45OTk2MTQgTDM1Ljk5OTgxMTksMzQuOTk5NjE0IEwzNiwyNi42NjI3NDQ2IEMzNiwyMi4xOTY2NDM5IDMzLjY3NjM3NDMsMjAuMTE4MDQ3OSAzMC41NzY5MjEzLDIwLjExODA0NzkgWiBNMzAuNTc2OTIxMywyMC4xMTgwNDc5IiBpZD0iT3ZhbC0xIi8+PC9nPjwvZz48L3N2Zz4=" alt=""></img>
                </div>
                <span className="text-description mt-4 mb-2">or use email for registration</span>
                {active ? <LoginForm /> : <RegisterForm />}
            </div>
        </>
    );
};

export default AuthPage;