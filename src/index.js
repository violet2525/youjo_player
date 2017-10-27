(function(){
    'use strict';
    const electron = require('electron');
    const {remote} = require('electron');
    const fs = require('fs');
    const path = require('path');

    const media = require('../IGNORE/folder.json')
    const video = document.getElementById('video');

    const Menu = remote.Menu;
    const menuItem = remote.MenuItem;
     
    let menuTemplate = [
        {
            label: '常に前面に表示',
            type: 'checkbox',
            checked: remote.getCurrentWindow().isAlwaysOnTop(),
            click: (e) => {
                remote.getCurrentWindow().isAlwaysOnTop(!remote.getCurrentWindow().isAlwaysOnTop());
            }
        },
        {
            type: 'separator'
        },
        {
            label: '50%',
            type: 'normal',
            click: (e) => {
                let win = remote.getCurrentWindow();
                win.setContentSize(video.videoWidth * 0.5, video.videoHeight * 0.5);
            }
        },
        {
            label: '100%',
            type: 'normal',
            click: (e) => {
                let win = remote.getCurrentWindow();
                win.setContentSize(video.videoWidth * 1.0, video.videoHeight * 1.0);
            }
        },
        {
            label: '150%',
            type: 'normal',
            click: (e) => {
                let win = remote.getCurrentWindow();
                win.setContentSize(video.videoWidth * 1.5, video.videoHeight * 1.5);
            }
        },
        {
            label: '200%',
            type: 'normal',
            click: (e) => {
                let win = remote.getCurrentWindow();
                win.setContentSize(video.videoWidth * 2.0, video.videoHeight * 2.0);
            }
        },
        {
            type: 'separator'
        },
        {
            label: '閉じる',
            type: 'normal',
            role: 'close'
        }
    ]
    let menu = Menu.buildFromTemplate(menuTemplate);

    window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        menu.popup(remote.getCurrentWindow());
    });

    let mediaSelect = (index) => {
        if(index >= 100){
            //const nextIdx = (index >= 102 ? 100 : 101)
            video.src = media.default[parseInt(index.toString(10).slice(-1))];
            //video.dataset.index = nextIdx;
            //console.log([video.src, video.data])
            video.play();
        }else{
            fs.readdir(media.folder[0], (err, files) => {
                if(err !== null){
                    console.log(err);
                }
                files.sort();
                if(index === files.length){
                    index = 0
                    video.dataset.index = index;
                }
                video.src = path.join(media.folder[0], files[index]);
                //video.data = index;
                video.play();
            })
        }
    }

    //videoタグを監視
    const target = document.getElementById('video');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            //console.log(mutation);
            mediaSelect(video.dataset.index);
        });    
    });
    const config = {
        childList: true,
        attributes: true,
        characterData: true,
        attributeFilter: ['data-index']
    }
    observer.observe(target, config);

    //DOM要素読み込み完了時
    window.addEventListener('DOMContentLoaded', () =>{
        fs.readdir(media.folder[0], (err, files) => {
            video.dataset.length = files.length - 1;
        });
        video.dataset.index = 100;
    }, false);

    //メディア終了時
    video.addEventListener('ended', () => {
        if(video.dataset.index >= 100){
            video.dataset.index = (video.dataset.index == 101 ? 100 : 101)
        }else{
            video.dataset.index++;            
        }
    }, false);
})()