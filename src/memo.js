import axios from "axios";
import Swal from "sweetalert2";
import { getToken, defaultError } from "@/utils";
import { api } from "@/config";

function editMemo(m) {
    axios({
        method: "PUT",
        url: `${api.host}/memo/${m.id}`,
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
        data: {
            edit: m.edit,
            text: m.text.trim(),
            encrypted: m.encrypted,
        },
    })
        .then((e) => {
            const data = e.data;
            Swal.fire({
                icon: "success",
                text: data.meta.message,
                timer: 2022,
                timerProgressBar: true,
            });
        })
        .catch((e) => defaultError(e));
}

function deleteMemo(m, ms) {
    axios({
        method: "DELETE",
        url: `${api.host}/memo/${m.id}`,
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    })
        .then((e) => {
            const data = e.data;
            Swal.fire({
                icon: "success",
                text: data.meta.message,
                timer: 2022,
                timerProgressBar: true,
            });

            delete ms.value[m.id];
        })
        .catch((e) => defaultError(e));
}

export function saveMemo(m, ms) {
    if (m.text.trim().length == 0) {
        deleteMemo(m, ms);
    } else {
        editMemo(m);
    }
}
