# ShoppingMall WebSite

## WebPage Overview
1. /login = 로그인 페이지
2. /signup = 회원가입 페이지
3. /shop = 쇼핑몰 메인페이지

## Database
- table game
   name varchar(20)                       = 게임이름
   company varchar(20)                 = 배급사
   price int                                       = 가격
   img1 img2 img3 varchar(20)     = 데모사진
   property varchar(20)                  = 장르
   video varchar(50)                       = 트레일러(추가예정)
   
- table user_data
   id varchar(20) = 아이디
   passwd varchar(20) = 패스워드
   birth int = 생일
   email varchar(20) = 이메일
   property varchar(20) = 구매자, 판매자

- table gameDetail(추가예정)
