// ==UserScript==
// @name         BiliSCList
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动保存直播时发送的SC
// @author       Panedioic
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/gh/google/brotli@5692e422da6af1e991f9182345d58df87866bc5e/js/decode.js
// @require      https://cdn.jsdelivr.net/npm/pako@2.0.3/dist/pako_inflate.min.js
// @require      https://greasyfork.org/scripts/417560-bliveproxy/code/bliveproxy.js?version=931022
// @require      https://cdn.staticfile.org/jquery/1.11.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    const SCList = [];
    const TestData = {
        face: "https://i1.hdslb.com/bfs/face/3a4aff6ae3d0b38e12f97d31fd10e863f5dfb089.jpg",
        name: "Panedioic",
        ts: 1673432408,
        message: "这是一条测试 SC ！",
        price: 30
    };
    SCList.push(TestData);
    const TestData2 = {
        face: "https://i1.hdslb.com/bfs/face/3a4aff6ae3d0b38e12f97d31fd10e863f5dfb089.jpg",
        name: "Panedioic",
        ts: 1673434408,
        message: "这是另一条测试 SC ！",
        price: 30
    };
    SCList.push(TestData2);

    // 醒目留言
    bliveproxy.addCommandHandler('SUPER_CHAT_MESSAGE', command => {
        let data = command.data;
        SCList.push({
            face: data.user_info.face,
            name: data.user_info.uname,
            ts: data.ts,
            message: data.message,
            price: data.price
        });
        console.log('SC coming!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(command);
    });

    function getSCListStr(){
        let ret = '';
        for(let i = 0; i < SCList.length; i += 1){
            ret += '<p>-----------------------------------------</p><p>';
            ret += SCList[i].name;
            ret += ' ';
            ret += SCList[i].price + '元';
            ret += ' ';
            var date = new Date(SCList[i].ts * 1000);
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds();
            ret += h + m + s;
            ret += '</p><p>'
            ret += SCList[i].message;
            ret += '</p>';
        }
        return ret;
    }

    (function insertIconPanel() {
        var iconPanel = document.querySelector('.icon-left-part');
        var histPanel = document.querySelector('.chat-history-list');
        if (iconPanel) {
            let icon = document.createElement("button");
            icon.innerText="SCList";
            icon.style.background="#757575";//颜色弄得差不多吧
            icon.style.color="#fff";
            icon.onclick=function(){
                document.getElementById('sc-list-content').innerHTML = getSCListStr();
                document.getElementById('sc-list-panel').style.display='block';
                console.log('sanlian');
            };
            iconPanel.append(icon);

            let panel = document.createElement("div");
            panel.innerHTML=`
<div id="sc-list-panel" style="position:fixed;bottom:20px;right:20px;z-index:99999;width:300px;height:400px;background-color:#fff;display:none;overflow:scroll;">
SCList made by Panedioic.
    <a href="javascript:void(0)" onclick="document.getElementById('sc-list-panel').style.display='none';">
        关闭
    </a>
    <div id="sc-list-content">
    </div>
</div>`;
            document.body.append(panel);

            console.log('panel insert success!\n==========');
        } else {
            //console.log('panel insert wait!\n==========');
            requestAnimationFrame(function () {
                insertIconPanel();
            });
        }
    })();

})();
