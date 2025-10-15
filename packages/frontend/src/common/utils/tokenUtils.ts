/**
 * Kiểm tra xem JWT token có hợp lệ không
 */
export function isTokenValid(token: string | null): boolean {
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000; // Convert to seconds
        
        // Kiểm tra token có hết hạn không
        return payload.exp > currentTime;
    } catch (error) {
        console.error('Error parsing token:', error);
        return false;
    }
}

/**
 * Lấy thông tin payload từ JWT token
 */
export function getTokenPayload<T = any>(token: string): T | null {
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error('Error parsing token payload:', error);
        return null;
    }
}

/**
 * Tính thời gian còn lại của token (tính bằng milliseconds)
 */
export function getTokenTimeRemaining(token: string): number {
    const payload = getTokenPayload(token);
    if (!payload || !payload.exp) return 0;
    
    const currentTime = Date.now() / 1000;
    const timeRemaining = (payload.exp - currentTime) * 1000;
    
    return Math.max(0, timeRemaining);
}

/**
 * Kiểm tra token có sắp hết hạn không (trong vòng 5 phút)
 */
export function isTokenExpiringSoon(token: string, thresholdMinutes = 5): boolean {
    const timeRemaining = getTokenTimeRemaining(token);
    const thresholdMs = thresholdMinutes * 60 * 1000;
    
    return timeRemaining <= thresholdMs;
}
