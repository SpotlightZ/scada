export interface DrawingElementPropsView {
    groups: {
        id: string;
        label: string;
        items: DrawingElementPropsViewGroupItem[];
    }[]
};

export type DrawingElementPropsViewGroupItem =
    ({
        type: 'number';
        label: string;
        digits?: number;
        step?: number;
        min?: number;
        max?: number;
    } |
    {
        type: 'color';
        label: string;
    } |
    {
        type: 'select'
        label: string;
        options: {
            label: string;
            value: string;
        }[]
    } |
    {
        type: 'text';
        label: string;
    } |
    {
        type: 'boolean';
        label: string;
    } |
    {
        type: 'json';
        label: string;
    }) & {
        propPath: string;
    };

export const defaultInstanceFromSchema = (schema: DrawingElementPropsView) => {
    const instance: any = {};
    schema.groups.forEach(group => {
        group.items.forEach(item => {
            switch (item.type) {
                case 'number':
                    instance[item.label] = 0;
                    break;
                case 'color':
                    instance[item.label] = '#000000';
                    break;
                case 'select':
                    instance[item.label] = item.options[0].value;
                    break;
                case 'text':
                    instance[item.label] = '';
                    break;
                case 'boolean':
                    instance[item.label] = false;
                    break;
                case 'json':
                    instance[item.label] = {};
                    break;
            }
        });
    });
    return instance;
};



export type DrawingElementPropsSchemaGroupItemValueType =
    {
        type: 'number';
        value: number;
    } | {
        type: 'color';
        value: string;
    } | {
        type: 'select';
        value: string;
    } | {
        type: 'text';
        value: string;
    } | {
        type: 'boolean';
        value: boolean;
    } | {
        type: 'json';
        value: any;
    };

export const LayoutSchema: DrawingElementPropsView = {
    groups: [
        {
            id: 'layout',
            label: '布局',
            items: [
                {
                    propPath: "layout.size.width",
                    type: 'number',
                    label: 'W'
                },
                {
                    propPath: "layout.size.height",
                    type: 'number',
                    label: 'H',
                },
                {
                    propPath: "layout.position.x",
                    type: 'number',
                    label: 'X',
                },
                {
                    propPath: "layout.position.y",
                    type: 'number',
                    label: 'Y',
                },
                {
                    propPath: "layout.rotation",
                    type: 'number',
                    label: '<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 4V40H44" stroke="#333" stroke-width="4" stroke-linecap="square" stroke-linejoin="round"/><path d="M28 40C28 28.9543 19.0457 20 8 20V40H28Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="square" stroke-linejoin="round"/></svg>',
                }
            ]
        }
    ]
};

export const StyleSchema: DrawingElementPropsView = {
    groups: [
        {
            id: 'style',
            label: '样式',
            items: [
                {
                    propPath: "style.fill",
                    type: 'text',
                    label: '填充',
                },
                {
                    propPath: "style.stroke",
                    type: 'text',
                    label: '边框',
                },
                {
                    propPath: "style.strokeWidth",
                    type: 'number',
                    label: '边框尺寸',
                }
            ]
        }
    ]
};

export const TextContentView: DrawingElementPropsView = {
    groups: [
        {
            id: 'text',
            label: '文本',
            items: [
                {
                    propPath: "style.content.text",
                    type: 'text',
                    label: '内容',
                },
                {
                    propPath: "style.fontSize",
                    type: 'number',
                    label: '字号',
                },
                {
                    propPath: "style.fontFamily",
                    type: 'text',
                    label: '字体',
                },
                {
                    propPath: "style.fontWeight",
                    type: 'text',
                    label: '字重',
                }
            ]
        }
    ]
};


export function propViews(...args: DrawingElementPropsView[]): DrawingElementPropsView {
    const propsView: DrawingElementPropsView = { groups: [] };
    args.forEach(view => {
        view.groups.forEach(group => {
            propsView.groups.push(group);
        });
    });
    return propsView;
}