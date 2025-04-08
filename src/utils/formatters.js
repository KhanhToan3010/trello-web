
import _ from "lodash"

export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

// khi keo card di chuyen qua 1 column rong tao cho column rong 1 card 
//nhung set hidden or hieight 0 de phat hien va cham khi keo
export const generatePlaceholderCard = (column) => {
  return{
    _id: `column-id-${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

