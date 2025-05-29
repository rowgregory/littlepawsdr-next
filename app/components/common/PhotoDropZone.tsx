import React, { FC } from 'react'
import AwesomeIcon from '../common/AwesomeIcon'
import Picture from '../common/Picture'
import { uploadIcon } from 'app/lib/font-awesome/icons'
import Spinner from './Spinner'
import { PhotoDropZoneProps } from 'app/types/form-types'

const PhotoDropZone: FC<PhotoDropZoneProps> = ({ inputRef, image, name, maintainAspectRatio, handleDrop, loading, handleFileChange }) => {
  return (
    <>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, name)}
        onClick={() => inputRef?.current?.click()}
        className="w-full h-auto border-2 border-dotted bg-zinc-50 dark:bg-charcoal border-ash dark:border-zinc-600 aspect-video flex flex-col items-center justify-center p-4 cursor-pointer relative"
      >
        {loading ? (
          <Spinner fill="fill-azure dark:fill-amathystglow" />
        ) : image ? (
          <Picture src={image} className={`w-full h-full ${maintainAspectRatio ? 'object-contain' : 'object-cover'}`} priority={true} />
        ) : (
          <>
            <AwesomeIcon icon={uploadIcon} className="w-4 h-4 mb-1.5 text-azure dark:text-amathystglow" />
            <p className="text-sm text-[#7e7e7e]">Drag & Drop or Click</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, name)} />
    </>
  )
}

export default PhotoDropZone
