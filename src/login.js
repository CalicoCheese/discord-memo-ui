import axios from "axios";
import { getPayload, getToken } from "./utils";

const tokenKey = "dmui-token";
const adminKey = "dmui-admin";

export function getRawToken() {
    // 아무런 검증없이 토큰 값만 반환
    return localStorage.getItem(tokenKey);
}

export function doLogin(token) {
    // 로컬 스토리지에 토큰 저장
    localStorage.setItem(tokenKey, token);
}

export function isLogin() {
    const payload = getPayload();

    // 토큰이 없거나 올바르지 않다면
    if (payload == undefined) {
        // 로그인 상태가 아님
        return false;
    }

    // 토큰 페이로드에서 토큰 유효 시간 불러오기
    const exp = payload.time.exp;
    const iat = payload.time.iat;

    // MS 단위를 S 단위로 변경
    const now = Date.now() / 1000;

    // 현재시간이 유효시간보다 크고 만료시간보다 작다면
    if (iat <= now < exp) {
        // 토큰이 만료 상태가 아님!
        // - 다만 그 토큰이 유효한 토큰인지는 **모름**
        return true;
    } else {
        // 토큰이 만료 상태임
        // - 유효시간보다 과거거나 만료시간보다 미래
        return false;
    }
}

export function clearLogin() {
    localStorage.removeItem(tokenKey); // 토큰     삭제
    localStorage.removeItem(adminKey); // 관리자값 삭제
}

export function updateToken() {
    axios({
        method: "GET",
        url: "/token",
        headers: {
            Authorization: getToken(),
        },
    })
        .then((resp) => {
            const data = resp.data;

            doLogin(data.data.token);
            setAdmin(data.data.is_admin);

            // eslint-disable-next-line
            console.log("[login.js] 인증 토큰을 연장했습니다.");
        })
        .catch((err) => {
            // eslint-disable-next-line
            console.log("[login.js] 인증 토큰 연장 실패.");

            if (process.env.NODE_ENV !== "production") {
                if (err.response == undefined) {
                    // eslint-disable-next-line
                    console.debug("--> API 서버 연결 실패");
                } else {
                    // eslint-disable-next-line
                    console.debug(err.response.data);
                }
            }
        });
}

// admin part
export function setAdmin(check) {
    if (check) {
        localStorage.setItem(adminKey, "yes");
    } else {
        localStorage.setItem(adminKey, "no");
    }
}

export function isAdmin() {
    const t = localStorage.getItem(adminKey);
    return t === "yes";
}
