import { useNavigate } from 'react-router-dom';

declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

export default function useLoginFacebook() {
    const FACEBOOK_APP_ID = import.meta.env.VITE_APP_FACEBOOK_APP_ID;
    const navigate = useNavigate();
    // Initial SDK — once call (thường trong App.tsx hoặc useEffect)
    const initFacebookSDK = () => {
        window.fbAsyncInit = () => {
            window.FB.init({
                appId: FACEBOOK_APP_ID,
                autoLogAppEvents: true,
                cookie: true,
                xfbml: true,
                version: "v19.0",
            });
            console.log("✅ FB SDK initialized", window.FB);
        };

        const id = "facebook-jssdk";
        if (!document.getElementById(id)) {
            const fjs = document.getElementsByTagName("script")[0];
            const js = document.createElement("script");
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";

            if (fjs?.parentNode) {
                fjs.parentNode.insertBefore(js, fjs);
            } else {
                const head = document.getElementsByTagName("head")[0];
                if (head) head.appendChild(js);
            }
            console.log("🚀 FB script inserted");
        }
    };

    const handleFacebookLogin = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            if (!window.FB) {
                return reject(new Error('Facebook SDK not loaded yet'));
            }

            window.FB.login(
                (response: any) => {
                    if (response.status === 'connected' && response.authResponse) {
                        const auth = response.authResponse;
                        // persist short-lived access token (dev convenience)
                        try {
                            saveFbToken(auth.accessToken);
                        } catch (e) { 
                            console.warn('save token error', e); 
                        }

                        // fetch user profile
                        window.FB.api('/me', { fields: 'id,name,email,picture' }, (userInfo: any) => {
                            try { localStorage.setItem('fb_user', JSON.stringify(userInfo)); } catch (e) { /* ignore */ }
                            resolve({ authResponse: auth, user: userInfo });
                        });
                    } else {
                        console.error('❌ Login failed:', response);
                        reject(new Error('Facebook login failed'));
                    }
                },
                { scope: 'public_profile' }
            );
        });
    };

    const saveFbToken = (token: string) => {
        try {
            localStorage.setItem('fb_access_token', token);
        } catch (e) { 
            console.warn('saveFbToken error', e); 
        }
    };

    const getFbToken = (): string | null => {
        try { return localStorage.getItem('fb_access_token'); } catch (e) { return null; }
    };

    const clearFbToken = () => {
        try {
            localStorage.removeItem('fb_access_token');
            localStorage.removeItem('fb_user');
            localStorage.removeItem('sidebar_collapsed');
        } catch (e) { /* ignore */ }
    };

    const restoreFbLogin = (): Promise<any> => {
        return new Promise((resolve) => {
            if (!window.FB) return resolve(null);
            window.FB.getLoginStatus((resp: any) => {
                if (resp.status === 'connected') {
                    // fetch basic profile
                    window.FB.api('/me', { fields: 'name,email,picture' }, (userInfo: any) => {
                        resolve({ ...resp, user: userInfo });
                    });
                } else {
                    // not connected, clear any stale token
                    clearFbToken();
                    resolve(null);
                }
            });
        });
    };

    const loginWithFacebook = async () => {
        try {
            const data = await handleFacebookLogin();
            // you can work with `data` here (authResponse + user)
            navigate('/');
            return data;
        } catch (err) {
            console.error('Facebook login failed:', err);
            throw err;
        }
    };

    const logout = () => {
        try {
            if (typeof window !== 'undefined' && (window as any).FB && typeof (window as any).FB.logout === 'function') {
                (window as any).FB.logout(() => {
                    /* noop */
                });
            }
        } catch (e) {
            // ignore
        }
        try { clearFbToken(); } catch (e) { }
        navigate('/auth/login');
    };

    return {
        loginWithFacebook,
        initFacebookSDK,
        logout,
    }
}