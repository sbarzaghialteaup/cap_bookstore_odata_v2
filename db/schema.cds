namespace sap.capire.bookshop;

using {
  Currency,
  managed
} from '@sap/cds/common';

entity Books : managed {
  key ID       : Integer;
      title    : localized String(111);
      descr    : localized String(1111);
      author   : Association to Authors;
      stock    : Integer;
      price    : Decimal(9, 2);
      currency : Currency;
}

entity Authors : managed {
  key ID    : Integer;
      name  : String(111);
      books : Association to many Books
                on books.author = $self;
}

entity Orders : managed {
  key ID      : UUID;
      OrderNo : String
        @(
          title:       'Order Number',
          description: 'Description'
        );
      Items   : Composition of many OrderItems
                  on Items.parent = $self;
}

entity OrderItems {
  key ID     : UUID;
      parent : Association to one Orders;
      book   : Association to one Books;
      amount : Integer;
}