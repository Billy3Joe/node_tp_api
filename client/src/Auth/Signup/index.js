import React from 'react';

const Signup = () => {
    return (
        <div>
            <form action="" method="post">
                <div>
                    <label htmlFor="">Nom</label>
                    <input type="text" className='form-control' />
                </div>
                <div>
                    <label htmlFor="">Email</label>
                    <input type="email" className='form-control' />
                </div>
                <div>
                    <label htmlFor="">Téléphone</label>
                    <input type="number" className='form-control' />
                </div>
                <div>
                    <label htmlFor="">Rôle</label>
                    <input type="text" className='form-control' />
                </div>
                <div>
                    <label htmlFor="">Password</label>
                    <input type="text" className='form-control' />
                </div>
            </form>
        </div>
    );
};

export default  Signup;