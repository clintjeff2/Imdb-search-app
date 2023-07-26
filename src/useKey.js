import { useEffect } from 'react'

function useKey(key, funcAction) {
  
  useEffect(() => {
    const callCallback = (e) => {
      // console.log(e.code, typeof(e.code))
      if(e.code.toLowerCase() === key.toLowerCase()) return funcAction();
    }
    document.addEventListener('keydown', callCallback)

    return function(){
      document.removeEventListener('keydown', callCallback);
    }
  }, [funcAction]);
  
  return ;
}

export {useKey}