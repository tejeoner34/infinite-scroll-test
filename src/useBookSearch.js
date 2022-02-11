import { useEffect, useState } from "react";
import axios from 'axios';

export default function useBookSearch(query, pageNumber){

    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(()=>{
        setBooks([]);
    },[query])

    useEffect(()=>{

        if(query==='')return
        let cancel;
        setIsLoading(true);
        axios({
            method:'GET',
            url:'https://openlibrary.org/search.json',
            params:{q: query, page: pageNumber},
            cancelToken: new axios.CancelToken(c=> cancel = c)
        }).then(res=> {
            console.log(res.data)
            setHasMore(res.data.docs.length>0)
            setIsLoading(false)
            setBooks(oldValue=> [...new Set([...oldValue, ...res.data.docs.map(b=>b.title)])])
        }).catch(e=>{
            if(axios.isCancel(e)) return
        });
           

        return ()=>cancel();



    },[query,pageNumber])


    return {books, hasMore, isLoading}
}