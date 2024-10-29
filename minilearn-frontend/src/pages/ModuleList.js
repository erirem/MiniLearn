import React, {useEffect, useState} from 'react';

function ModuleList(){
    const [modules, setModules] = useState([]);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async() => {
            try{
                const res = await fetch('http://localhost:3000/api/modules')
                const data = await res.json();
                setModules(data.modules);
            } catch(error){
                console.error('Modüller yüklenirken hata:', error);
            } finally{
                setLoading(false);
            }
        };
       fetchModules();
        }, []);
        if(loading) return <p>Loading...</p>

        return(
            <div className= "p-8">
                      <h1 className="text-3xl font-bold mb-6">Education Modules</h1>
                      <ul>
                        {modules.map((module) => (
                            <li key={module.id} className="mb-4 p-4 border rounded">
                                <h2 className="text-xl font-semibold">{module.title}</h2>
            <p>{module.description}</p>
          </li>
                        ))}
                      </ul>
            </div>
            );
    }
    export default ModuleList;