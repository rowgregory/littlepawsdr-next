const RegisterModal = ({ modal, handleClose, auth }: any) => {
  return (
    <div>
      <div className="bg-white rounded-xl p-8 w-full">
        <i onClick={handleClose} className="fa-solid fa-xmark fa-sm text-gray-500 flex justify-end mb-4 cursor-pointer"></i>
        {modal?.text === 'Password is not strong enough' ? (
          <div className="mb-4">
            <i className="fa-solid fa-circle-check text-red-500 fa-2x flex justify-center mb-3"></i>
            <p className="text-red-500 text-md font-Matter-Medium text-center">{modal?.text}</p>
          </div>
        ) : (
          <>
            <i className="fa-solid fa-circle-check text-teal-500 fa-2x flex justify-center mb-3"></i>
            <p className="text-teal-500 text-md font-Matter-Medium text-center">{modal?.text}</p>
          </>
        )}
        {modal.help && (
          <>
            <h3 className="font-Matter-Medium mb-4 text-lg">Password requirements</h3>
            <div className="flex items-center">
              <i className={`${auth?.validations[0] === 1 ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'}  mr-2`}></i>
              <p className="font-Matter-Regular text-gray-700">must be at least 9 characters</p>
            </div>
            <div className="flex items-center">
              <i
                className={`${
                  auth?.validations[1] === 1 ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'
                } text-green-500 mr-2`}
              ></i>
              <p className="font-Matter-Regular text-gray-700">must contain a capital letter</p>
            </div>
            <div className="flex items-center">
              <i
                className={`${
                  auth?.validations[2] === 1 ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'
                } text-green-500 mr-2`}
              ></i>
              <p className="font-Matter-Regular text-gray-700">must contain a number</p>
            </div>
            <div className="flex items-center">
              <i
                className={`${
                  auth?.validations[3] === 1 ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'
                } text-green-500 mr-2`}
              ></i>
              <p className="font-Matter-Regular text-gray-700">
                must contain one symbol ~&#96;!&#45;&#64;#$%^&amp;*()_+&#123;&#125;&#124;:&#34;&#59;&#39;,&#46;&#63;
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RegisterModal
