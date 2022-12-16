export type ArticleType  = {
    title: string;
    link: string;
    pubDate: string;
    author: string;
    content: string;
    contentSnippet: string;
    id: string;
    isoDate: string;
}

//     {
//     title: 'My first script in a while, a Powershell MSI extractor!',
//     link: 'https://www.reddit.com/r/programming/comments/yzk53r/my_first_script_in_a_while_a_powershell_msi/',
//     pubDate: '2022-11-19T19:37:44.000Z',
//     author: '/u/jamesfarted09',
//     content: '&#32; submitted by &#32; <a href="https://www.reddit.com/user/jamesfarted09"> /u/jamesfarted09 </a> <br/> <span><a href="https://github.com/JamesIsWack/Simple-MSI-Extractor">[link]</a></span> &#32; <span><a href="https://www.reddit.com/r/programming/comments/yzk53r/my_first_script_in_a_while_a_powershell_msi/">[comments]</a></span>',
//     contentSnippet: 'submitted by    /u/jamesfarted09  \n [link]   [comments]',
//     id: 't3_yzk53r',
//     isoDate: '2022-11-19T19:37:44.000Z'
//   }