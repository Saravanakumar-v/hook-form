import { Controller, SubmitHandler, useForm} from "react-hook-form";
import { Switch, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { DevTool } from "@hookform/devtools";


interface BuyOrderForm {
    product_type: any
    order_type: any
    quantity: number
    disclosed_quantity: number
    price_within: number
    validity: any
    AMO: boolean
}

export function NormalOrderFormComponent() {
    const stock_price = 1441.25;

    const {register ,control, handleSubmit,setError, clearErrors, watch, unregister , formState: {errors}} = useForm<BuyOrderForm>({
        defaultValues: {
            product_type: "MTF",
            order_type: "Limit",
            validity: "DAY",
            quantity: 1,
            price_within: stock_price
        }
    });

    const product_type = ["MTF","Delivery","Intraday","Cover","Bracket"];
    const order_type = ["Limit","Market","SL","SL-M"];
    const quantity_lot = [80,200,400,810]
    const validity = ["DAY","IOC"]
    
    const [order, setOrder] = useState<any>();
    const form_data : SubmitHandler<BuyOrderForm> = (data) => {console.log(data); setOrder(data)};
    

    function handleQuantityInput(param: any) {
        var quantity: any = document.getElementById("quantity-inpt");
        quantity.value = param;
    }

    const disclosed_quantity = watch("disclosed_quantity");
    const quantity = watch("quantity");
    const price_within = watch("price_within");
    const validity_type = watch("validity")

    useEffect(() => {
        console.log(typeof quantity);
        
        
        if(quantity === 0) {
            console.log("true");
            setError("quantity",{
                type: "manual",
                message: "Enter a valid qty"
            })
        } else {
            clearErrors("quantity")
        }

        if(disclosed_quantity === 0 && quantity <= 10) {
            setError("disclosed_quantity", {
                type: "manual",
                message: `Disclosed qty should be 10% of quantity i.e 1`
            })
        } else if(disclosed_quantity === 0 && quantity > 10) {
            setError("disclosed_quantity", {
                type: "manual",
                message: `Disclosed qty should be 10% of quantity`
            })
        } else {
            clearErrors("disclosed_quantity")
        }

        if((disclosed_quantity !== 0 && quantity >= 10) || (disclosed_quantity !== 0  && quantity <= 10) ) {
            const minimum_disclosedQty = quantity * 0.1;

            if(disclosed_quantity !== quantity) {
                if(disclosed_quantity < minimum_disclosedQty) {
                    setError("disclosed_quantity", {
                    type: "manual",
                    message: `Disclosed qty should be 10% of quantity i.e ${minimum_disclosedQty}`
                })}
                else if(disclosed_quantity > quantity) {
                    setError("disclosed_quantity", {
                        type: "manual",
                        message: `Disclosed qty should not be greater than quantity`
                    })
                } else {
                    clearErrors("disclosed_quantity")
                }
            }
        }

        if (price_within) {
            if(price_within > (stock_price+100) || price_within < (stock_price-100) ) {
                setError("price_within", {
                    type: "manual",
                    message: `Enter the price within ( ${stock_price-100} - ${stock_price+100} )`
                })
            } else {
                clearErrors("price_within")
            }
        }

        if (validity_type) {
            if(validity_type === 'IOC') {
                unregister("disclosed_quantity")
                let disclosed_qty: any = document.getElementById("disclosedQty");
                disclosed_qty.value = '';

            } else {
                register("disclosed_quantity")
            }
        }
    }, [quantity,disclosed_quantity,price_within, validity_type,clearErrors,setError,register,unregister]);

    function onlyNumber(event: any) {
        const key = event.key;
        const regex = /[0-9]/;
        if(event.keyCode === 8 || event.keyCode === 46) {
            return true;
        }
        if (!regex.test(key)) {
            event.preventDefault();
            return null;
        }
    }  

    return (
        <>
        <div className="form">
            <div className="buy-form-container">
                <h3>Normal Form - Current Stock Price: {stock_price}</h3>
                <div className="form-container">
                    <div className="buy-form-container_content">
                    <form id="buy-form" onSubmit={handleSubmit(form_data)}>

                        <div className="product-type">
                            <label>Product Type</label>

                            <Controller name="product_type" control={control} render={({field}) => 
                                <ToggleButtonGroup exclusive color="primary" {...field}>
                                    {product_type.map((item) => {
                                        return (
                                            <ToggleButton key={item} value={item}>{item}</ToggleButton>
                                        );
                                    })}
                                </ToggleButtonGroup>
                            }/>
                        </div>

                        <div className="order-type">
                            <label>Order Type</label>

                            <Controller name="order_type" control={control} render={({field}) => 
                            <ToggleButtonGroup exclusive color="primary" {...field}>
                                {order_type.map((item) => {
                                    return (
                                        <ToggleButton  key={item} value={item}>{item}</ToggleButton>
                                    );
                                })}
                            </ToggleButtonGroup>
                            }/>
                        </div>

                        <div className="quantity">
                            <div className="inpt">
                                <div>
                                    <label>Quantity</label>
                                    {errors.quantity ? <div className="error">{errors.quantity.message}</div> : <div></div>}
                                </div>
                                <input type="text" id="quantity-inpt" onKeyDown={(event) => onlyNumber(event)}
                                    {...register("quantity",{
                                        required: true, 
                                        valueAsNumber: true,
                                        min : {
                                            value: 1,
                                            message: "Enter a valid qty"
                                        }})} 
                                ></input>
                            </div>
                            <div className="lot-toggle">

                            <Controller
                                name="quantity"
                                control={control}
                                render={({ field }) => (
                                    <ToggleButtonGroup exclusive value={field.value} onChange={(event, value) => {field.onChange(value);handleQuantityInput(value)}} color="primary">
                                        {quantity_lot.map((item) => (
                                            <ToggleButton key={item} value={item}>
                                                {item}
                                            </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                )}
                                />
                            </div>
                        </div>

                        <div className="disclosed-quantity">
                            <div className="inpt">
                                <div>
                                    <label>Disclosed quantity</label>
                                    {errors.disclosed_quantity ?<div className="error">{errors.disclosed_quantity.message}</div> :<div></div>}
                                </div>

                                <input type="text" id="disclosedQty" disabled={watch("validity") === "IOC" ?true :false} onKeyDown={(event) => onlyNumber(event)} 
                                    {...register("disclosed_quantity",{
                                        valueAsNumber: true,
                                        min: {
                                            value: watch("quantity")*0.1,
                                            message: `Disclosed qty should be 10% of quantity i.e ${quantity*0.1}   `
                                        },max: {
                                            value: watch("quantity"),
                                            message: `Disclosed qty should not be greater than quantity`
                                        }})}
                                ></input>
                            </div>
                        </div>

                        <div className="price">
                            <div className="inpt">
                                <div>
                                    <label>Price (Within)</label>
                                    {errors.price_within ?<div className="error">Enter the price within ({stock_price-100} - {stock_price+100})</div> :<div></div>}
                                </div>
                                <input type="text" {...register("price_within",{required: true  ,valueAsNumber: true, min: stock_price-100, max: stock_price+100})} onKeyDown={(event) => onlyNumber(event)}></input>
                            </div>
                        </div>

                        <div className="validity">
                            <label>Validity</label>

                            <Controller name="validity" control={control} render={({ field }) => (
                                <ToggleButtonGroup exclusive color="primary" {...field}>
                                {validity.map((item) => (
                                    <ToggleButton key={item} value={item}>
                                            {item}
                                    </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}/>
                        </div>

                        <div className="AMO">
                            <label>AMO</label>
                            <Switch {...register("AMO")}/>
                        </div>

                    </form>
                </div>
                </div>

                <div className="summary">
                    <input className="trade-btn" form="buy-form" type="submit" value="QUICK TRADE"/>
                    <div>Marg. Req : ₹ {watch("quantity")*stock_price}</div>
                </div>
            </div>


            <div className="form-order">
                <pre className="pretty-json">{JSON.stringify(order,null,'\t')}</pre>
            </div>
        </div>
        <DevTool control={control} /> {/* set up the dev tool */}

        </>
    );
}