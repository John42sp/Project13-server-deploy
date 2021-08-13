import multer from 'multer';
import path from 'path';



export default {    
     storage: multer.diskStorage({  
        destination: function (req, file, cb) {
       // destination: path.join(__dirname, '..', '..', 'uploads'),
            if (file.fieldname === 'images') {
              cb(null, 'uploads/imgUpload')
            } else if (file.fieldname === 'videos') {
              cb(null, 'uploads/vidUpload')
            } else {
              console.log(file.fieldname)
            //   cb({ error: 'Mime type not supported' })
            }
          },
        
        filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`;

            cb(null, filename);
        },
    }),

    // limits:
    //     { 
    //       fileSize:'2mb' 
    //     },

    
    limits: (req: Request, file: any, fileSize: any) => {
        if (file.fieldname === "images") { // if uploading resume
               return fileSize = '1mb'
            } else if (file.fieldname === "videos") { 
                return fileSize = '200mb'
            } else {
               return 'We could not upload some of your files. Maybe it was big, try smaller'
            }

            },


    fileFilter: (req: Request, file: any, cb: any) => {
        if (file.fieldname === "images") { // if uploading resume
              // Accept images only
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                // req.fileValidationError = 'Only image files are allowed!';
                return cb(new Error('Only image files allowed in this field!'), false);
            }
            cb(null, true);
            } else if (file.fieldname === "videos") { 
            // Accept videos only
            if (!file.originalname.match(/\.(mp4|MP4|mov|MOV||avi|AVI|)$/)) {
                // req.fileValidationError = 'Only image files are allowed!';
                return cb(new Error('Only video files allowed in this field!'), false);
            }
            cb(null, true);
            } else {
                cb(null, false); // else fails
            }

            }


}
