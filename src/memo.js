import axios from "axios";
import Swal from "sweetalert2";
import { getToken, defaultError } from "@/utils";
import { log } from "@/logger";

function fetchMemo(id, memos) {
    axios({
        method: "GET",
        url: `/memo/${id}`,
        headers: {
            Authorization: getToken(),
        },
    })
        .then((resp) => {
            const data = resp.data;
            let ctx = data.data;

            if (ctx.encrypted) {
                ctx.encCipher = ctx.text;
                ctx.needDecrypt = true;
            }

            // 암호화라면 숨기고 평문이면 보여주고
            ctx.display = !ctx.encrypted;

            memos.value[ctx.id] = ctx;

            log("memo.js", `${ctx.id} 번 메모를 불러왔습니다.`);
        })
        .catch((err) => defaultError(err));
}

function editMemo(memo, memos) {
    let text = memo.text.trim();
    if (memo.encrypted) {
        text = memo.encCipher;
    }

    axios({
        method: "PUT",
        url: `/memo/${memo.id}`,
        headers: {
            Authorization: getToken(),
        },
        data: {
            edit: memo.edit,
            text: text,
            encrypted: memo.encrypted,
        },
    })
        .then((resp) => {
            log("memo.js", `${memo.id} 번 메모를 수정했습니다.`);

            const data = resp.data;
            Swal.fire({
                icon: "success",
                text: data.meta.message,
                timer: 2022,
                timerProgressBar: true,
            });

            fetchMemo(memo.id, memos);
        })
        .catch((err) => defaultError(err));
}

function deleteMemo(memo, memos) {
    axios({
        method: "DELETE",
        url: `/memo/${memo.id}`,
        headers: {
            Authorization: getToken(),
        },
    })
        .then((resp) => {
            log("memo.js", `${memo.id} 번 메모를 삭제했습니다.`);

            const data = resp.data;
            Swal.fire({
                icon: "success",
                text: data.meta.message,
                timer: 2022,
                timerProgressBar: true,
            });

            delete memos.value[memo.id];
        })
        .catch((err) => defaultError(err));
}

export function saveMemo(memo, memos) {
    log("memo.js", `${memo.id} 번 메모의 저장 요청이 들어왔습니다.`);

    if (memo.text.trim().length == 0) {
        deleteMemo(memo, memos);
    } else {
        editMemo(memo, memos);
    }
}

export function createMemo() {
    return new Promise((resolve, reject) => {
        Swal.fire({
            input: "textarea",
        }).then((swalResp) => {
            axios({
                method: "POST",
                url: `/memo`,
                headers: {
                    Authorization: getToken(),
                },
                data: {
                    text: swalResp.value,
                    encrypted: false,
                },
            })
                .then((resp) => {
                    log("memo.js", "새로운 메모를 생성했습니다.");
                    resolve(resp);
                })
                .catch((err) => {
                    log("memo.js", "새로운 메모를 생성하지 못 했습니다.");
                    reject(err);
                });
        });
    });
}
