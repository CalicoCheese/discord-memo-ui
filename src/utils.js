import { Buffer } from "buffer/";
import Swal from "sweetalert2";
import { token } from "@/config";
import router from "./router";

export function getRawToken() {
    return localStorage.getItem(token.key);
}

export function getToken() {
    let token = getRawToken();

    if (token == null) {
        token = "undefined";
    }

    return `Bearer ${token}`;
}

export function getPayload() {
    const token = getRawToken();

    if (token == null || token == undefined) {
        return undefined;
    }

    try {
        return JSON.parse(
            Buffer.from(
                localStorage.getItem("dmui-token").split(".")[1],
                "base64"
            ).toString()
        );
    } catch {
        return undefined;
    }
}

export function setAdmin() {
    localStorage.setItem(token.admin, "yes");
}

export function notAdmin() {
    localStorage.removeItem(token.admin);
}

export function isAdmin() {
    const t = localStorage.getItem(token.admin);
    return t === "yes";
}

export function login() {
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

export function logout() {
    localStorage.clear();
    sessionStorage.clear();
}

export function defaultError(err) {
    if (err.response == undefined) {
        Swal.fire({
            icon: "error",
            text: "알 수 없는 오류가 발생했습니다.",
            timer: 2022 * 4,
            timerProgressBar: true,
        }).then(() => {
            router.push({ name: "Home" });
        });
    } else {
        const data = err.response.data;

        if (data.meta.code == 401) {
            logout();
        }

        Swal.fire({
            icon: "error",
            title: data.meta.code,
            text: data.meta.message,
            timer: 2022,
            timerProgressBar: true,
        }).then(() => {
            if (!login()) {
                router.push({ name: "Home" });
            }
        });
    }
}

export function getDate(timeStamp) {
    let d = new Date(timeStamp * 1000);
    return d.toLocaleDateString();
}
