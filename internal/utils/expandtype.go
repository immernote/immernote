package utils

import "github.com/samber/lo"

var (
	BlockLike = []string{"paragraph"}
	FieldLike = []string{"text_field"}
	ViewLike  = []string{"table_view"}
	PageLike  = []string{"page", "database"}
)

func ExpandTypes(types []string) []string {
	list := []string{}

	for _, item := range types {
		switch item {
		case "block_like":
			list = append(list, BlockLike...)
		case "field_like":
			list = append(list, FieldLike...)
		case "view_like":
			list = append(list, ViewLike...)
		case "page_like":
			list = append(list, PageLike...)
		default:
			list = append(list, item)
		}
	}

	return list
}

func GetTypeLikes(t string) []string {
	switch {
	case lo.Contains(BlockLike, t):
		return BlockLike
	case lo.Contains(FieldLike, t):
		return FieldLike
	case lo.Contains(ViewLike, t):
		return ViewLike
	case lo.Contains(PageLike, t):
		return PageLike
	default:
		return []string{}
	}
}

func IsTypeLike(t string, l string) bool {
	switch l {
	case "block":
		return lo.Contains(BlockLike, t)
	case "field":
		return lo.Contains(FieldLike, t)
	case "view":
		return lo.Contains(ViewLike, t)
	case "page":
		return lo.Contains(PageLike, t)
	default:
		return false
	}
}
