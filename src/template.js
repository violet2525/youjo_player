class videoControl extends HTMLElement{

    constructor(){
        super();
    }

    connectedCallback(){
        const ownerDocument = document.currentScript.ownerDocument;
        const template = ownerDocument.getElementById('video-control');
        const instance = template.content.cloneNode(true);

        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(instance);
        
        let seek = shadowRoot.getElementById("seek_bar");
        let seek_blank = shadowRoot.getElementById("seek_bar_blank");
        let volume = shadowRoot.getElementById('volume_bar');
        let volume_blank = shadowRoot.getElementById("volume_bar_blank");

        let barChange = function(bar, blank) {
            let b_v = bar.value,
            max = bar.max,
            range_x = bar.clientWidth;
            let b_r =  (range_x / max);
            b_r = (b_r * b_v);                
            blank.style.width = b_r + "px";
            //blank.style.width = b_v+"%";        
        }    

        //イベントハンドラ
        this.close = shadowRoot.getElementById('close');
        this.close.addEventListener('click', this.onClose.bind(this));
        this.pin = shadowRoot.getElementById('pin');
        this.pin.addEventListener('click', this.onPin.bind(this), false);
        this.back = shadowRoot.getElementById('back');
        this.back.addEventListener('click', this.onBack.bind(this), false);
        this.next = shadowRoot.getElementById('next');
        this.next.addEventListener('click', this.onNext.bind(this), false);
        this.play = shadowRoot.getElementById('play');
        this.play.addEventListener('click', this.onPlay.bind(this), false);
        this.mute = shadowRoot.getElementById('volume_icon');
        this.mute.addEventListener('click', this.onMute.bind(this), false);

        let _self = this;
        
        let video = document.getElementById('video');
        video.addEventListener('timeupdate', function(){
            _self.onPlayNow();
            barChange(seek, seek_blank);
        }, false);

        video.addEventListener('volumechange', function(){
            _self.onVolumeNow();
            barChange(volume, volume_blank);
        }, false);

        document.addEventListener('DOMContentLoaded', function(){
            seek.addEventListener('change', function(){
                barChange(seek, seek_blank)
                _self.onSeek();
            }, false);
            seek.addEventListener('input', function(){
                barChange(seek, seek_blank)
                _self.onSeek();
            }, false);

            volume.addEventListener('change', function(){
                barChange(volume, volume_blank);
                _self.onVolume();
            },false);
            volume.addEventListener('input', function(){
                barChange(volume, volume_blank)
                _self.onVolume();
            },false);
        }, false)
    }

    //closeボタン
    onClose(){
        const {remote} = require('electron');
        remote.getCurrentWindow().close();
    }

    //常に前面に表示
    onPin(){
        const {remote} = require('electron');
        let win = remote.getCurrentWindow();
        win.setAlwaysOnTop(!(win.isAlwaysOnTop()));
    }

    //前の動画
    onBack(){
        let video = document.getElementById('video');
        if(video.dataset.index >= 100){
            //OP/ED繰り返し
            video.dataset.index = (video.dataset.index == 101 ? 100 : 101)
        }else if(video.dataset.index === 0){
            //最初の動画
            video.dataset.index = 100;
        }else{
            video.dataset.index--;
        }
    }

    //次の動画
    onNext(){
        let video = document.getElementById('video');
        if(video.dataset.index >= 100){
            video.dataset.index = 0;
        }else if(video.dataset.length === video.dataset.index){
            video.dataset.index = 100;
        }else{
            video.dataset.index++;
        }
    }

    //再生・停止
    onPlay(){
        let video = document.getElementById('video');
        let playButton = this.shadowRoot.getElementById('play_icon');
        if(video.paused === true){
            //一時停止中なら再生開始
            video.play()
            playButton.className = 'fa fa-pause button_60';
        }else{
            //再生中なら一時停止
            video.pause()
            playButton.className = 'fa fa-play button_60';
        }
    }

    onSeek(){
        let seek = this.shadowRoot.getElementById('seek_bar');
        let video = document.getElementById('video');
        const videoPosition = video.duration * seek.value / 100;
        video.currentTime = videoPosition;
    }

    onPlayNow(){
        let seek = this.shadowRoot.getElementById('seek_bar');
        let video = document.getElementById('video');
        const videoPosition = video.currentTime / video.duration * 100;
        seek.value = videoPosition;
    }

    onVolume(){
        let volume = this.shadowRoot.getElementById('volume_bar');
        let video = document.getElementById('video');
        if(video.muted === true){
            video.muted = false;
        }
        video.volume = volume.value / 100;
    }

    onMute(){
        //let volume = this.shadowRoot.getElementById('volume_bar');
        let video = document.getElementById('video');
        video.muted = !video.muted;
        //this.onVolumeNow();
    }

    onVolumeNow(){
        let volume = this.shadowRoot.getElementById('volume_bar');
        let video = document.getElementById('video');
        if(video.muted === true){
            volume.value = 0;
        }else{
            volume.value = video.volume * 100;
        }
    }
}

customElements.define('video-control', videoControl);