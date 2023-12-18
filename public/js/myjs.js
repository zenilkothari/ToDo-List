function myClick(e){
debugger
    e.preventDefault();
    let newItem = document.getElementById("newItem").value;
    
    let crypt = new Crypt();
    let publicKey = "-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAkqq3QgdocHrFa2LG3YPNtS1YCSbqFhxM2ZMCWfzcHSooYIYsE9RJwieYTylrJMhnjRTYANGZCF8VC8LEV5TFkD7P29bSVTbfUlQCfPOPMrZQ7tNETmmeDEZeRJ266PFYKdM+TZchgEJu0jRC9eFDDNz4/GxGn1maHDjD4X/5kYDwz7TreoPQQaioukFiYd5h6BAaaopLqLgPNZ+P4vQa4naHuwm1yiG6JIb0aMwdXCLE4WUOe+wZn0JYUxDhdSdLZLpTawL64r4Rg6apRvsR9jREu6dmoGu15D2Em7YEXGmzLN7NDf/9Bx8O+jx/+zJal65FhqtiiOswnait5oyCAkjipqHQx663HvIYK65YWcnUI5Ea6rqebSzGH72tHMfIFGwZSROQBxIRKQUyTCPlzVgl7ndT9J80DLDCZLGh5PXIh8CwxP8llWn2IiujQ9Yiag2j8iibTpjgqymo5TPW8VXVo9uDG8EfaHopx1EE3MVCPk8MSVnx2DNjWsCEVKCC572seQt1gmtso4oCaTMsdQjEG+C6x+52C8jJiakLlHctPQ4h4rmT+zLIsbzGnzluZCYnKAMwTVa04G5YIj/p001Ega1set9IVQAL+0qMAq1nn9ANkSalY5joroDRbBl+y1ck5VxAo9/p9LGN3sDz2wW2/yNG9dmhpWJO5TmL/QsCAwEAAQ==-----END PUBLIC KEY-----";
    newItem = crypt.encrypt(publicKey, newItem);

    document.getElementById("newItem").value = newItem;
    
    let form = document.getElementById("myForm");

    form.submit();
}