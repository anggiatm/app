(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Asynchronous Module Definition) support
        define(['exports'], function (exports) {
            root.core = factory(exports);
        });
    } else if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS (Node.js) support
        module.exports = factory({});
    } else {
        // Browser global
        root.core = factory({});
    }
}(typeof self !== 'undefined' ? self : this, function (exports) {
    'use strict';

    function control(value){
        const data = {
            control: value
        }
        fetch('/control', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    function save_settings(){

        const rtspUrl = document.getElementById('rtsp-url').value;
        const threshold = document.getElementById('threshold').value;

        const data = {
            RTSP_URL: rtspUrl,
            threshold: parseFloat(threshold)
        };

        fetch('/save_settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            refresh_settings()
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    function refresh_settings(){
        fetch('/settings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Tentukan tipe konten sebagai JSON
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Jika server merespons dengan JSON, Anda dapat memprosesnya di sini
        })
        .then(data => {
            console.log('Server response:', data);
            document.getElementById('rtsp-url').value = data.RTSP_URL;
            document.getElementById('threshold').value = data.threshold;

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle error
        });
    }

    function splitArrayByClassId(array) {
        const uniqueClassIds = [...new Set(array.map(obj => obj.age))];
        const result = {};

        uniqueClassIds.forEach(classId => {
            result[classId] = array.filter(obj => obj.age === classId);
        });
        return result;
    }

    function get_now(){
        let today = new Date();
        let year = today.getFullYear();
        let month = ('0' + (today.getMonth() + 1)).slice(-2); // Tambahkan 1 karena bulan dimulai dari 0
        let day = ('0' + today.getDate()).slice(-2);
        let date = year + '-' + month + '-' + day;
        return date;
    }

    function refresh_datas(){
        let date = get_now();
        fetch('/datas/'+ date+" 00:00:00/"+date+" 23:59:59", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Tentukan tipe konten sebagai JSON
            },
            // body: JSON.stringify({ date_from: date+" 00:00:00", date_to: date+" 23:59:59"}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Jika server merespons dengan JSON, Anda dapat memprosesnya di sini
        })
        .then(data => {
            // Memecah array berdasarkan class_id
            console.log(data);
            const class_all = data.length;
            const splitData = splitArrayByClassId(data);

            const class_0 = splitData['1'] === undefined ? 0 : splitData['1'].length;
            const class_1 = splitData['2'] === undefined ? 0 : splitData['2'].length;
            const class_2 = splitData['3'] === undefined ? 0 : splitData['3'].length;
            const class_3 = splitData['4'] === undefined ? 0 : splitData['4'].length;
            const class_4 = splitData['5'] === undefined ? 0 : splitData['5'].length;
            const class_5 = splitData['6'] === undefined ? 0 : splitData['6'].length;
            const class_6 = splitData['7'] === undefined ? 0 : splitData['7'].length;
            const class_7 = splitData['8'] === undefined ? 0 : splitData['8'].length;

            document.getElementById('class-0').innerText = class_0;
            document.getElementById('class-1').innerText = class_1;
            document.getElementById('class-2').innerText = class_2;
            document.getElementById('class-3').innerText = class_3;
            document.getElementById('class-4').innerText = class_4;
            document.getElementById('class-5').innerText = class_5;
            document.getElementById('class-6').innerText = class_6;
            document.getElementById('class-7').innerText = class_7;
            document.getElementById('class-all').innerText = class_all;

            document.getElementById('persentage-0').innerText = (class_0/class_all*100).toFixed(2) + '%';
            document.getElementById('persentage-1').innerText = (class_1/class_all*100).toFixed(2) + '%';
            document.getElementById('persentage-2').innerText = (class_2/class_all*100).toFixed(2) + '%';
            document.getElementById('persentage-3').innerText = (class_3/class_all*100).toFixed(2) + '%';
            document.getElementById('persentage-4').innerText = (class_4/class_all*100).toFixed(2) + '%';
            document.getElementById('persentage-5').innerText = (class_5/class_all*100).toFixed(2) + '%';
            document.getElementById('persentage-6').innerText = (class_6/class_all*100).toFixed(2) + '%';
            document.getElementById('persentage-7').innerText = (class_7/class_all*100).toFixed(2) + '%';

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    function deque(){
        fetch('/get_deque', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response =>{
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            // console.log('Deque:', data);
            data = data.deque;
            console.log(data);
            data.map((item, index)=>{
                const img = new Image();
                img.src = 'data:image/jpeg;base64,' + item.img_name;
                img.style = 'height:110px';
                document.getElementById('image-container-'+ index).innerHTML = '';
                document.getElementById('image-container-'+ index).appendChild(img);

                let age = '';

                if (item.gender == 1){
                    if (item.age == 0){
                        age = 'child';
                    }
                    else if (item.age == 1){
                        age = 'man';
                    }
                    else if (item.age == 2){
                        age = 'senior';
                    }
                    else if (item.age == 3){
                        age = 'teen';
                    }
                    else{
                        age = 'unknown';
                    }
                }

                else {
                    if (item.age == 0){
                        age = 'child';
                    }
                    else if (item.age == 1){
                        age = 'senior';
                    }
                    else if (item.age == 2){
                        age = 'teen';
                    }
                    else if (item.age == 3){
                        age = 'woman';
                    }
                    else{
                        age = 'unknown';
                    }
                }

                // mc ,mm, ms, mt
                // fc ,fs, ft, fw

                let time = item.timestamp.split(" ")
                time = time[time.length-2]

                document.getElementById('attr-container-'+ index).innerHTML = `Gender = ${item.gender ? 'Male':'Female'}
                                                                                <br>
                                                                                Age = ${age} - ${item.age_score}%
                                                                                <br>
                                                                                Headwear = ${item.attr_headwear}
                                                                                <br>
                                                                                Mask = ${item.attr_mask}
                                                                                <br>
                                                                                Glasses = ${item.attr_glasses}
                                                                                <br>
                                                                                ${time}`;
            })
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    document.addEventListener('DOMContentLoaded', refresh_settings);
    document.addEventListener('DOMContentLoaded', refresh_datas);

    setInterval(refresh_datas, 10000);
    setInterval(deque, 1000);

    exports.control = control;
    exports.save_settings = save_settings;
    return exports;
}));
