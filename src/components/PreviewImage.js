import React, { useState } from 'react'
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import '../css/PreviewImage.css';


function PreviewImage({previewImage, images, setImages, previewImageUrl, setPreviewImageUrl, setPreviewImageName, closePreviewWindow}) {
    const [showImageCloseButton, setShowImageCloseButton] = useState(false);

    const removeImage = (image) => {

        if(images.length === 1){
            closePreviewWindow();
        }else{
            const index = images.indexOf(image);

            setImages(images.filter((image, i) => i!== index));

            if(previewImageUrl === image.previewUrl){
                setPreviewImageUrl(images[0].previewUrl)
                setPreviewImageName(images[0].name)
            }
        }
    }

    return (
        <div onClick={() => setPreviewImageUrl(previewImage.previewUrl)} onMouseEnter={() => setShowImageCloseButton(true)} onMouseLeave={() => setShowImageCloseButton(false)} style={{backgroundImage: "url("+`${previewImage.previewUrl}`+")"}} className="smallPreviewImage">
            { 
                showImageCloseButton && 
                    <div className="remove__image__background">
                        <IconButton style={{color: "white", position: "absolute", right: "0", padding: "0"}} onClick={(e) => {e.stopPropagation(); removeImage(previewImage);}}>
                            <CloseIcon />
                        </IconButton>
                    </div>
            }
        </div>
    )
}

export default PreviewImage
