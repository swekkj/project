(function (w, $) {
    
    /**
     * ----------------------------------
     * @ Plug-in Dialog
     * Created by jaehee on 2016. 03
     * ----------------------------------
     */
    
    // 다이얼로그 팝업 플로그인 이름 정의
    var pluginName = 'dialog';
    
    // Init Dialog 객체 생성자
    function Dialog($selector, options) {
        
        // 타켓을 참조
        this.$selector = $selector;
        
        // 플러그인 옵션값을 config 멤버에 플러그인 내부적으로 셋팅된 기본 옵션값과 사용자 정의의 옵션값을 확장,머지 하도록 한다.
        this.config = $.extend({}, this.defaults, options || {});

        this._init();
        this._setEvent();
    }
    
    Dialog.prototype = {
        // 플러그인 기본 옵션값 셋팅
        'defaults' : {
            modalClose : '.btnp-close',
            fade : false,
            fadeSpeed : 400,
            dimmed : true,
            dimOpacity : .8,
            bodyScroll : false,
            escKey : false,
            clickDimmed : true
        },
        '_init' : function () {
            
            this.$targetData = this.$selector.data('popup');
            this.$modalContent = $(this.$targetData);
            // 레이어 팝업내의 닫기 버튼 선택
            this.$modalClose = this.$modalContent.find(this.config.modalClose);
            
            // document, window 객체와 body 를 제이쿼리 객체로 참조
            this.detect = {
                $doc  : $(document),
                $win  : $(window),
                $body : $('body')
            };
            
         },
        '_setEvent' : function () {
            
            // 인스턴스 객체 참조
            var _self = this;
            
            // modal [show|fade] event 등록
            this.detect.$doc.on('click', '[data-popup="' + this.$targetData + '"]', function (e) {
                
                // _self : 이벤트 내의 this 는 DOM Element 를 가리키므로
                // 생성자를 통해 생성된 객체의 this 에 멤버를 추가하기 위해 위에서 참조하고 있는 _self 를 사용한다.
                !_self.config.bodyScroll && _self._lockScroll();
                _self._modalPosition();
                _self.config.fade ? _self._modalFadeIn() : _self._modalShow();
                _self.config.clickDimmed && _self._clickDimmed();
                return false;
            });
            
            // modal close event 등록
            this.$modalClose.on('click', function () {
                !_self.config.bodyScroll && _self._unlockScroll();
                _self.config.fade ? _self._modalFadeOut() : _self._modalHide();
                _self.config.dimmed && _self.$dimLayer.remove();
            });
            
            // ESC 키 event 등록
            if (this.config.escKey) {
                this.detect.$doc.on('keydown', function (e) {
                    _self._isCheckedESC(e);
                })
            }
            
        },
        '_modalPosition' : function () {
            var modalWidth      = this.$modalContent.outerWidth(),
                modalHeight     = this.$modalContent.outerHeight(),
                windowHeight    = this.detect.$win.height(),
                modalHalfWidth  = (modalWidth / 2),
                modalHalfHeight = (modalHeight / 2);
            
            if (modalHeight < windowHeight) {
                this.$modalContent.css({
                    marginLeft : -modalHalfWidth,
                    marginTop : -modalHalfHeight
                })
            } else {
                this.$modalContent.css({
                    marginLeft : -modalHalfWidth,
                    top : 50
                })
            }
            
            // 옵션 값에 dimmed 가 true 라면 딤드를 설정
            this.config.dimmed && this._setDimmed();
            
        },
        '_modalShow' : function () {
            this.$modalContent.show();
            this._dimShow();
            this._focusIn();
        },
        '_modalHide' : function () {
            this.$modalContent.hide();
            this._dimHide();
            this._focusOut();
        },
        '_modalFadeIn' : function () {
            this.$modalContent.fadeIn(this.config.fadeSpeed);
            this._dimFadeIn();
            this._focusIn();
        },
        '_modalFadeOut' : function () {
            this.$modalContent.fadeOut(this.config.fadeSpeed);
            this._dimFadeOut();
            this._focusOut();
        },
        '_focusIn' : function () {
            this.$modalContent
                .attr('tabindex', 0)
                .focus();
        },
        '_focusOut' : function () {
            this.$selector
                .attr('tabindex', 0)
                .focus();
            this.$modalContent.attr('tabindex', -1)
        },
        '_setDimmed' : function () {
            this.detect.$body.append('<div class="dim-layer">');
            this.$dimLayer = $('.dim-layer');
            var dimLayerConfig = {
                'display' : 'none',
                'position' : 'fixed',
                'left' : 0,
                'right' : 0,
                'top' : 0,
                'bottom' : 0,
                'background' : '#000',
                'z-index' : 9999
            };
            this.$dimLayer
                .css(dimLayerConfig)
                .css({opacity : this.config.dimOpacity});
        },
        '_dimFadeIn' : function () {
            this.config.dimmed && this.$dimLayer.fadeIn();
        },
        '_dimFadeOut' : function () {
            this.config.dimmed && this.$dimLayer.fadeOut();
        },
        '_dimShow' : function () {
            this.config.dimmed && this.$dimLayer.show();
        },
        '_dimHide' : function () {
            this.config.dimmed && this.$dimLayer.hide();
        },
        '_lockScroll' : function () {
            this.detect.$body.addClass('layer-scroll');
        },
        '_unlockScroll' : function () {
            this.detect.$body.removeClass('layer-scroll');
        },
        '_isCheckedESC' : function (e) {
            if(e.which == 27) {
                this.$modalContent.hide();
                if (this.config.dimmed) {
                    this._setDimmed();
                    this.$dimLayer.remove();
                }
                this._focusOut();
            }
        },
        '_clickDimmed' : function () {
            var _self = this;
            if(this.config.clickDimmed && this.$dimLayer) {
                this.$dimLayer.on('click', function(e) {
                    _self.$modalContent.hide();
                    $(this).remove();
                    _self._focusOut();
                    return false;
                })
            }
        }
    };
    
    // $('.selector').dialog(); // 플러그인 호출 시 사용될 인자로 options(객체리터럴) 전달
    $.fn[pluginName] = $.fn[pluginName] || function (options) {
            
            // 여기서 this 는 플러그인 호출 시 $('.selector').dialog() 할 때 정의하는 선택자를 가리킨다.
            // 예를 들어, $('.layer').dialog() 호출 시 넘긴 선택자인 $('.layer') 를 참조한다. 즉, 제이쿼리 객체를 참조
            var $this = this;
            
            // 선택자 대상이 여러 개일 경우를 감안하여 $.each() 반복문을 사용
            return $.each($this, function (idx, el) {
                // 플러그인 대상 선택자를 참조
                var $element = $this.eq(idx);
                
                // 여기서 this 는 DOM Element 을 참조한다.
                // console.log(this);
                
                // $.data()는 HTML 엘리먼트 내에 데이터를 저장하고 읽는 역할을 하는 함수
                // 문법 : jQuery.data( element, key, value )
                // key : string type의 변수로 data가 저장될 key 값입니다.
                
                // 대상 선택자인 this(DOM Element)에 plugin_dialog key 정의되어 있지 않다면 value 값을 설정한다.
                if (!$.data(this, 'plugin_' + pluginName)) {
                    // 조건이 true 라면
                    // 해당 DOM Element 에 키에 대한 값으로 즉, value 로 생성자 함수(new)를 호출하여 객체를 생성한 것을 담아 저장하도록 한다.
                    // 생성자의 인자로 타켓 선택자와 사용자 정의의 플러그인 옵션을 지정하도록 한다.
                    $.data(this, 'plugin_' + pluginName, new Dialog($element, options));
                    // 플러그인을 호출하게 되면 생성자 함수를 호출하게 되고 생성자 함수 내에서는 타켓 선택자, 옵션값을 전달받게 된다.
                }
                
                // jQuery 체이닝 메소드를 계속 실행하기 위해 제이쿼리 객체를 반환시킨다.
                // 만약 반환값을 정의하지 않는다면 this 를 반환하게 된다.
                // 이 스코프는 객체 내부이므로 반환값을 정의하지 않더라도 undefined 가 아닌 객체 자신을 반환한다.
                // 그러므로 반환값을 정의하지 않는다면 자신의 this 객체를 반환하는데 여기서 this 는 DOM Element 객체를 참조하고 있다.
                // 이대로 this 를 반환하게 되면 제이쿼리 체이닝 메소드를 더이상 사용하지 못하게 된다.
                // 예를 들어, $('.layer-popup').dialog().addClass('active') 와 같이
                // 사용자 정의 플러그인을 호출한 후 계속하여 제이쿼리에 속한 메소드를 사용하고자 할 경우 제이쿼리 객체를 반환해야 한다.
                // DOM Element 를 반환하게 될 경우 더이상 제이쿼리 메소드를 체이닝(체이닝 메소드의 연결 고리가 끊김)하지 못하게 되므로 제이쿼리 객체를 반환하도록 한다.
                return $element;
                
            });
        }
        
}(window, window.jQuery));

$(function () {
    // 모달 팝업 보기 버튼에 data 설정하기 data-layer-btn="#layer01", 앵커 해쉬값과 동일하게 설정하는 것을 권장
    $('.layer-popup').dialog({
        modalClose : '.btnp-close', // 레이어 팝업 콘텐츠내의 닫기 버튼 클래스를 변경할 경우에 사용
        fade : false,               // 페이드 이펙트를 사용할 경우에 사용
        fadeSpeed : 400,            // 페이드 이펙트를 사용할 때 페이드 속도를 제어
        dimmed : true,              // 딤드 사용을 제어
        dimOpacity : .8,            // 딤드 효과를 사용할 경우에 opacity를 제어
        escKey : false,             // esc 키를 눌러서 레이어를 닫고자 할 경우에 사용
        clickDimmed : false,        // 딤드 영역을 클릭해서 레이어를 닫고자 할 경우에 사용
        bodyScroll : false          // 레이어 팝업 시 콘텐츠 스크롤 여부 제어
    })
});