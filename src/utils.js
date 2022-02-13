import { createHash, pbkdf2Sync } from "crypto";
import config from "@/config";

export function getToken() {
    return localStorage.getItem(config.token.key);
}

export function getPayload() {
    const token = getToken();

    if (token == null || token == undefined) {
        return undefined;
    }

    return JSON.parse(
        Buffer.from(
            localStorage.getItem("dmui-token").split(".")[1],
            "base64"
        ).toString()
    );
}

export function login() {
    const exp = Number(localStorage.getItem(config.token.exp));

    if (
        // 만료시간이 숫자가 아닌 경우
        exp < 0
    ) {
        // 인정하지 않음
        return false;
    }

    // 유효 시간 구하기
    const iat = exp - 3 * 60 * 60;

    // MS 단위를 S 단위로 변경
    const now = Date.now() / 1000;

    if (
        // 유효시간이 없는 경우
        iat == null ||
        iat == "undefined" ||
        // 만료시간이 없는 경우
        exp == null ||
        exp == "undefined"
    ) {
        // 만료된 토큰
        return false;
    }

    // 현재시간이 유효시간보다 크고 만료시간보다 작다면
    if (iat <= now < exp) {
        // 토큰을 불러오고
        const token = getToken();

        // 토큰이 null이 아니라면 로그인 상태임
        // 다만 그 토큰이 유효한 토큰인지는 **모름**
        return token != null;
    } else {
        // 유효시간보다 과거거나 만료시간보다 미래
        return false;
    }
}

export function logout() {
    localStorage.clear();
    sessionStorage.clear();
}

export function setPassword(password_hashed) {
    if (password_hashed.length == 128) {
        sessionStorage.setItem(config.token.password, password_hashed);

        return true;
    } else {
        return false;
    }
}

export function getPassword() {
    const pass = sessionStorage.getItem(config.token.password);

    if (pass == null || pass == undefined) {
        return undefined;
    } else if (pass.length == 128) {
        return pass;
    } else {
        return undefined;
    }
}

export function getMemoKey() {
    const password = getPassword();
    const payload = getPayload();

    if (password == undefined || payload == undefined) {
        return undefined;
    }

    const i_am_not_salt_just_a_message =
        "change da world my final message. Goodbye";

    const sha512 = createHash("sha512");
    const key = sha512
        .update(
            `${payload.user.id}+${password}+${i_am_not_salt_just_a_message}`
        )
        .digest("base64");

    const iv = sha512
        .update(
            `${payload.user.id}+${i_am_not_salt_just_a_message}+${password}+`
        )
        .digest("base64");

    const pbk = {
        key: pbkdf2Sync(
            Buffer.from(key, "base64"),
            Buffer.from(iv, "base64"),
            10000,
            256 / 8,
            "sha512"
        ).toString("hex"),
        iv: pbkdf2Sync(
            Buffer.from(iv, "base64"),
            Buffer.from(key, "base64"),
            10000,
            128 / 8,
            "sha512"
        ).toString("hex"),
    };

    if (process.env.NODE_ENV !== "production") {
        console.debug(`
from base64 import b64decode\n
key = b64decode(b"${key}").hex()
iv = b64decode(b"${iv}").hex()\n
key == "${Buffer.from(key, "base64").toString("hex")}"
iv == "${Buffer.from(iv, "base64").toString("hex")}"\n
print(f"생성된 키: ${pbk.key}")
print(f"생성된 iv: ${pbk.iv}")`);
    }

    return pbk;
}
