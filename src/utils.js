import { Buffer } from "buffer/";
import Swal from "sweetalert2";
import router from "./router";
import { getRawToken, isLogin, clearLogin } from "./login";
import { log } from "@/logger";

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

export function defaultError(err) {
    if (err.response == undefined) {
        log("utils.js", "알 수 없는 오류가 발생했습니다.");

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
            clearLogin();
        }

        log("utils.js", `오류발생! ${data}`);

        Swal.fire({
            icon: "error",
            title: data.meta.code,
            text: data.meta.message,
            timer: 2022,
            timerProgressBar: true,
        }).then(() => {
            if (!isLogin()) {
                router.push({ name: "Home" });
            }
        });
    }
}

export function getDate(timeStamp) {
    let d = new Date(timeStamp * 1000);
    return d.toLocaleDateString();
}
