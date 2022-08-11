import sharp from 'sharp';
import jimp from 'jimp';

export const removeAcento = (text: string): string => {
  let _text = text.toLowerCase();
  _text = _text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
  _text = _text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
  _text = _text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
  _text = _text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
  _text = _text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
  _text = _text.replace(new RegExp('[Ç]', 'gi'), 'c');
  return _text;
};

  // cropImage: (file) => {
  //   return jimp.read(file)
  // .then(lenna => {
  //   return lenna
  //     .resize(256, 256) // resize
  //     .quality(60) // set JPEG quality
  //     .greyscale() // set greyscale
  //     .write('new-sticker.png'); // save
  // })
  // .catch(err => {
  //   console.error(err);
  // });
  // }

