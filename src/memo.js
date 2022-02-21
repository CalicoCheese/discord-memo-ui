import axios from "axios";
import Swal from "sweetalert2";
import { getToken, defaultError } from "@/utils";
import { api } from "@/config";

function editMemo(memo) {
    let text = memo.text.trim();
    if (memo.encrypted) {
        text = memo.encCipher;
    }

    axios({
        method: "PUT",
        url: `${api.host}/memo/${memo.id}`,
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
            const data = resp.data;
            Swal.fire({
                icon: "success",
                text: data.meta.message,
                timer: 2022,
                timerProgressBar: true,
            });
        })
        .catch((err) => defaultError(err));
}

function deleteMemo(memo, memos) {
    axios({
        method: "DELETE",
        url: `${api.host}/memo/${memo.id}`,
        headers: {
            Authorization: getToken(),
        },
    })
        .then((resp) => {
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
    if (memo.text.trim().length == 0) {
        deleteMemo(memo, memos);
    } else {
        editMemo(memo);
    }
}

export function createMemo() {
    return new Promise((resolve, reject) => {
        Swal.fire({
            input: "textarea",
        }).then((swalResp) => {
            axios({
                method: "POST",
                url: `${api.host}/memo`,
                headers: {
                    Authorization: getToken(),
                },
                data: {
                    text: swalResp.value,
                    encrypted: false,
                },
            })
                .then((resp) => {
                    resolve(resp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });
}
