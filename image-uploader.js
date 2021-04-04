class ImageUploader {
  constructor (config) {
    const defaultConfig = {
      input: '',
      icon: 'fa-image',
      width: '180px',
      height: '180px',
      color: '#b2dcc8',
      format: null,
      size: null,
      ratio: null,  
      placeholder: '',
    }
    this.config = $.extend({}, defaultConfig, config);
    this.$input = $(this.config.input).attr('type', 'hidden');
    if (this.$input.length  == 0) {
      console.error(`找不到容器 ${this.config.input} 無法建立圖片上傳，請確認頁面內容是否有該容器`);
      return false;
    }
    this.config.format = (this.config.format)?this.config.format.replace(/\s/g, '').split(','):null;

    this.config.ratio = (this.config.ratio)?this.config.ratio.replace(/\s/g, '').split(','):null;
    this.init();
  }
  init () {
    this.render();
    this.bind();
  }

  render() {
    const id = `${this.$input.attr('name')}-image-uploader`;
    this.$label = $(`<label for="${id}" class="image-uploader-preview"><div class="image-uploader-icon"><i class="fa ${this.config.icon}"></i></div><span>${this.config.placeholder}</span></label>`),
    this.$preview = $(`<div class="image-uploader-preview" data-for="${id}"></div>`),
    this.$delete = $(`<button type="button" class="btn btn-sm btn-primary image-uploader-delete" data-for="${id}"><i class="fa fa-times"></i></button>`);

    this.$container = $(`<div class="image-uploader-unit">`);
    this.$file = $(`<input type="file" id="${id}" accept="image/*" style="display: none;">`);
    this.styling();

    //Create uploader UI 
    this.$delete.appendTo(this.$container);
    this.$preview.appendTo(this.$container);
    this.$label.appendTo(this.$container);
    this.$container.insertBefore(this.$input);

    //Create default image
    if (this.$input.val() !== '') {
      this.$delete.show();
      this.$preview.css({
          zIndex: 1,
          pointerEvents: 'unset',
          background: '#F2F2F2',
        });
      $(`<img src="${this.$input.val()}">`).css({
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
      }).appendTo(this.$preview);
    }

    //Leave the file input away from form
    this.$file.appendTo($('body'));
  }

  bind() {
    this.$file.on('change', this.validate.bind(this));
    this.$delete.on('click', this.delete.bind(this));
  }

  validate(evt) {
    evt.preventDefault();
    const $this = evt.target,
          file = $this.files[0],
          reader = new FileReader(),
          self = this;

    const format = (this.config.format)?checkFormat():true;
    const size = (this.config.size)?checkSize():true;
    
    if (format && size) {
      if (this.config.ratio) {
        checkRatio()
          .then(() => {
            this.previewAndWrite(file);
          })
          .catch(() => {
            this.error(`長寬比例不符(${this.config.ratio[0]}:${this.config.ratio[1]})，請檢查後重新上傳`);
          });
      } else {
        this.previewAndWrite(file);
      }
    } 

    function checkFormat() {
      const pre = 'image/';
      let r = false;
      for(let f = 0; f < self.config.format.length; f++) {
        if (file.type == pre + self.config.format[f]) {
          r = true;
          break;
        }
      }
      if (!r) self.error(`請上傳符合的圖片格式(${self.config.format.join(', ')})`);
      return r;
    }

    function checkSize() {
      if(Math.round(file.size/1000) > self.config.size) {
        self.error(`超過上傳容量上限(${self.config.size}KB)，請檢查後重新上傳`);
        return false;
      }
      return true;
    }

    function checkRatio() {
      return new Promise((resolve, reject) => {
        const URL = window.URL || window.webkitURL,
              $img = new Image(),
              w = parseInt(self.config.ratio[0]),
              h = parseInt(self.config.ratio[1]),
              legal = w/h;

        $img.onload = function () {
          const ratio = this.width/this.height;
          if (legal == ratio) {
            resolve();
          }else{
            reject();
          };
        };
        $img.onerror = function () {
          reject();
        }
        $img.src = URL.createObjectURL(file);
      });
    }
  }

  previewAndWrite(file) {
    readFile()
      .then(src => {
        const img = new Image(); 
        img.src = src; 
        $(img).css({
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'block',
        })

        this.$delete.show();
        this.$preview.html('').css({
          zIndex: 1,
          pointerEvents: 'unset',
          background: '#F2F2F2',
        });
        $(img).appendTo(this.$preview);
        this.$input.val(src);
      })
      .catch(err => {
        alert(err);
      })

    function readFile () {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);   
        };
        reader.onerror = () => {
          reject(reader.error) 
        }
        reader.readAsDataURL(file);
      });
    }
  }
  
  delete(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.clear();
    
  }

  error(msg) {
    alert(msg);
    this.clear();
    return false;
  }

  clear($btn) {
    this.$delete.hide();
    this.$input.val('');
    this.$file.val('');
    this.$preview.html('').css({
      zIndex: -1,
      pointerEvents: 'none',
      background: 'none',
    });
  }

  styling () {
    this.$container.css({
      display: 'inline-flex',
      width: this.config.width,
      height: this.config.height,
      border: '1px solid #CCC',
      margin: '0 10px 10px 0',
      position: 'relative',
    });

    this.$label.css({
      position: 'absolute',
      display: 'block',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      display: 'flex',
      color: this.config.color,
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
    })

    this.$label.find('.image-uploader-icon').css({
      position: 'relative',
      fontSize: '22px',
      display: 'flex',
      marginBottom: '5%',
      borderRadius: '50% 50%',
      width: '55px', 
      height: '55px',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #DDD',
      padding: '15px',
    });

    this.$preview.css({
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
    });

    this.$delete.css({
      position: 'absolute',
      top: '3%',
      right: '3%',
      zIndex: 2,
      display: 'none',
    });
  }
}


$.fn.imageUploader = function(config) {
  $.each(this, (i, el) => {
    const setting = ['width', 'height', 'icon', 'size', 'ratio', 'format', 'color'],
          type = $(el).attr('type');
    let dataConfig = {
      input: `[name="${$(el).attr('name')}"]`,
      placeholder: $(el).attr('placeholder'),
    };
    setting.forEach(s => {
      if ($(el).data(s)) {
        dataConfig[s] = $(el).data(s);
      }
    });

    const extend = $.extend({}, config, dataConfig);
    if (el.tagName == 'INPUT' && (type == 'text' || type == 'hidden')) {
      new ImageUploader(extend);
    };
  })
  return this;
};

